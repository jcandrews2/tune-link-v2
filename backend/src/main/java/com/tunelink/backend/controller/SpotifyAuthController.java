package com.tunelink.backend.controller;

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

@RestController
@RequestMapping("/auth")
public class SpotifyAuthController {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthController.class);

    @Value("${SPOTIFY_CLIENT_ID}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String clientSecret;

    private final String redirectUri = "http://localhost:5050/auth/callback";
    private String accessToken;

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        logger.info("Login endpoint hit");
        logger.info("Client ID: {}", clientId);
        logger.info("Redirect URI: {}", redirectUri);
        
        String state = UUID.randomUUID().toString();
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
    public ResponseEntity<Void> callback(@RequestParam String code) {
        logger.info("Callback received with code: {}", code);
        RestTemplate restTemplate = new RestTemplate();
        
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
                // Store the access token
                accessToken = (String) response.getBody().get("access_token");
                logger.info("Successfully obtained access token");
                
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

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken() {
        Map<String, String> response = new HashMap<>();
        response.put("access_token", accessToken);
        return ResponseEntity.ok(response);
    }
} 