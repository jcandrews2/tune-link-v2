package com.tunelink.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.List;

@Service
public class SpotifyService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private static final String SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

    @Autowired
    public SpotifyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public List<Map<String, Object>> getRecommendations(String accessToken, String recommendationParams) {
        try {
            // Parse the recommendation parameters
            Map<String, Object> params = objectMapper.readValue(recommendationParams, Map.class);
            
            // Build the URL with query parameters
            UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(SPOTIFY_API_BASE_URL + "/recommendations");
            
            // Add all non-null parameters to the query
            params.forEach((key, value) -> {
                if (value != null) {
                    builder.queryParam(key, value);
                }
            });

            // Create headers with authorization
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            // Make the request
            ResponseEntity<Map> response = restTemplate.exchange(
                builder.build().toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (List<Map<String, Object>>) response.getBody().get("tracks");
            } else {
                logger.error("Failed to get recommendations. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to get recommendations from Spotify");
            }
        } catch (Exception e) {
            logger.error("Error getting recommendations from Spotify", e);
            throw new RuntimeException("Error getting recommendations from Spotify", e);
        }
    }
} 