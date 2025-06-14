package com.tunelink.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Base64;

@Service
public class SpotifyService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyService.class);
    private static final String spotify_token_url = "https://accounts.spotify.com/api/token";
    
    private final RestTemplate restTemplate;

    @Value("${SPOTIFY_CLIENT_ID}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String clientSecret;

    private final String redirectUri = "http://localhost:5050/auth/callback";

    public SpotifyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Goes to Spotify to exchange the authorization code for an access token
    public Map<String, Object> exchangeCodeForToken(String code) {
        // Create auth header
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        
        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedCredentials);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Set up body parameters
        String requestBody = String.format(
            "code=%s&redirect_uri=%s&grant_type=authorization_code",
            code, redirectUri
        );

        // Make request to Spotify
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            spotify_token_url,
            HttpMethod.POST,
            request,
            Map.class
        );

        return response.getBody();
    }

    public Map<String, Object> getSpotifyUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        ResponseEntity<Map> userResponse = restTemplate.exchange(
            "https://api.spotify.com/v1/me",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            Map.class
        );
        return userResponse.getBody();
    }

    public Map<String, Object> getRecommendations(String accessToken, String request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        ResponseEntity<Map> recommendationsResponse = restTemplate.exchange(
            "https://api.spotify.com/v1/recommendations",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            Map.class
        );
        return recommendationsResponse.getBody();
    }
} 