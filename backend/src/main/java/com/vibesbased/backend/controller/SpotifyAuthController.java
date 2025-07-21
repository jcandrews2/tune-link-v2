package com.vibesbased.backend.controller;

import com.vibesbased.backend.model.User;
import com.vibesbased.backend.service.UserService;
import com.vibesbased.backend.service.SpotifyService;
import com.vibesbased.backend.config.UrlProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class SpotifyAuthController {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthController.class);

    @Value("${SPOTIFY_CLIENT_ID}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String clientSecret;

    private final UserService userService;
    private final SpotifyService spotifyService;
    private final UrlProperties urlProperties;

    public SpotifyAuthController(UserService userService, SpotifyService spotifyService, UrlProperties urlProperties) {
        this.userService = userService;
        this.spotifyService = spotifyService;
        this.urlProperties = urlProperties;
    }

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        String state = UUID.randomUUID().toString();
        String scope = "streaming user-read-email user-read-private";
        
        String authUrl = UriComponentsBuilder
            .fromHttpUrl(urlProperties.getSpotifyAuthBase() + "/authorize")
            .queryParam("response_type", "code")
            .queryParam("client_id", clientId)
            .queryParam("scope", scope)
            .queryParam("redirect_uri", urlProperties.getSpotifyAuthRedirect())
            .queryParam("state", state)
            .build()
            .toUriString();

        return ResponseEntity.status(302)
            .header("Location", authUrl)
            .build();
    }

    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam String code) {
        try {
            Map<String, Object> tokenResponse = spotifyService.exchangeCodeForToken(code);
            String accessToken = (String) tokenResponse.get("access_token");
            String refreshToken = (String) tokenResponse.get("refresh_token");
            Integer expiresIn = (Integer) tokenResponse.get("expires_in");

            Map<String, Object> spotifyUser = spotifyService.getSpotifyUserInfo(accessToken);
            String spotifyUserId = (String) spotifyUser.get("id");
            
            String profilePicture = null;
            if (spotifyUser.containsKey("images")) {
                List<Map<String, Object>> images = (List<Map<String, Object>>) spotifyUser.get("images");
                if (!images.isEmpty()) {
                    profilePicture = (String) images.get(0).get("url");
                }
            }

            User savedUser = userService.createOrUpdateUser(
                spotifyUserId,
                profilePicture,
                accessToken,
                refreshToken,
                System.currentTimeMillis() + (expiresIn * 1000)
            );

            ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(false) // TODO: Set true in production
                .path("/")
                .maxAge(Duration.ofSeconds(expiresIn))
                .sameSite("Lax")
                .build();

            return ResponseEntity.status(302)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header("Location", urlProperties.getFrontendBase())
                .build();

        } catch (Exception e) {
            return ResponseEntity.status(302)
                .header("Location", urlProperties.getFrontendBase() + "?error=auth_failed")
                .build();
        }
    }
} 