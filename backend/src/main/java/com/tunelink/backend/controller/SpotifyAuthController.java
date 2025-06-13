package com.tunelink.backend.controller;

import com.tunelink.backend.service.UserService;
import com.tunelink.backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class SpotifyAuthController {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthController.class);

    @Value("${SPOTIFY_CLIENT_ID}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String clientSecret;

    private final String redirectUri = "http://localhost:5050/auth/callback";
    private final UserService userService;
    private final RestTemplate restTemplate;

    public SpotifyAuthController(UserService userService, RestTemplate restTemplate) {
        this.userService = userService;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/login")
    public ResponseEntity<Void> login(@RequestParam String userId) {
        logger.info("Login endpoint hit for user: {}", userId);
        logger.info("Client ID: {}", clientId);
        logger.info("Redirect URI: {}", redirectUri);
        
        String state = userId; // Use userId as state to identify user in callback
        String scope = "streaming user-read-email user-read-private";
        
        String authUrl = UriComponentsBuilder
                .fromHttpUrl("https://accounts.spotify.com/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("scope", scope)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("state", state)
                .build()
                .toUriString();

        logger.info("Full auth URL: {}", authUrl);
        return ResponseEntity.status(302).header("Location", authUrl).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam String code, @RequestParam String state) {
        String userId = state; // Get userId from state parameter
        logger.info("Callback received with code: {} for user: {}", code, userId);
        
        // Create the request body
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        // Create headers
        HttpHeaders headers = new HttpHeaders();
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        headers.set("Authorization", "Basic " + encodedCredentials);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Create the request entity
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        try {
            // Make the request to Spotify
            ResponseEntity<Map> response = restTemplate.exchange(
                "https://accounts.spotify.com/api/token",
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Get the user and update their tokens
                Optional<User> userOpt = userService.getUser(userId);
                if (!userOpt.isPresent()) {
                    logger.error("User not found: {}", userId);
                    return ResponseEntity.status(500).build();
                }

                User user = userOpt.get();
                String accessToken = (String) response.getBody().get("access_token");
                String refreshToken = (String) response.getBody().get("refresh_token");
                Integer expiresIn = (Integer) response.getBody().get("expires_in");
                Long expiresAt = System.currentTimeMillis() + (expiresIn * 1000);
                
                user.setSpotifyAccessToken(accessToken);
                user.setSpotifyRefreshToken(refreshToken);
                user.setSpotifyTokenExpiresAt(expiresAt);
                
                userService.updateUser(user);
                logger.info("Successfully stored access token for user: {}", userId);
                
                // Redirect to frontend
                return ResponseEntity.status(302)
                    .header("Location", "http://localhost:3000/")
                    .build();
            } else {
                logger.error("Failed to get access token. Status: {}", response.getStatusCode());
                return ResponseEntity.status(500).build();
            }
        } catch (Exception e) {
            logger.error("Error exchanging code for token", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/token/{userId}")
    public ResponseEntity<Map<String, String>> getToken(@PathVariable String userId) {
        try {
            return userService.getUser(userId)
                .map(user -> {
                    if (user.getSpotifyAccessToken() == null) {
                        return ResponseEntity.status(401).body(Map.of("error", "User not authenticated with Spotify"));
                    }
                    
                    // Check if token is expired
                    if (user.getSpotifyTokenExpiresAt() < System.currentTimeMillis()) {
                        return ResponseEntity.status(401).body(Map.of("error", "Token expired"));
                    }
                    
                    return ResponseEntity.ok(Map.of("access_token", user.getSpotifyAccessToken()));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
        } catch (Exception e) {
            logger.error("Error getting access token for user: {}", userId, e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
} 