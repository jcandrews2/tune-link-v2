package com.vibesbased.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.json.JSONObject;
import org.json.JSONArray;
import org.springframework.web.util.UriComponentsBuilder;
import com.vibesbased.backend.model.Track;
import java.util.HashMap;
import com.vibesbased.backend.config.UrlProperties;

@Service
public class SpotifyService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyService.class);
    
    private final RestTemplate restTemplate;
    private final UrlProperties urlProperties;

    @Value("${SPOTIFY_CLIENT_ID}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String clientSecret;

    public SpotifyService(RestTemplate restTemplate, UrlProperties urlProperties) {
        this.restTemplate = restTemplate;
        this.urlProperties = urlProperties;
    }

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
            code, urlProperties.getSpotifyAuthRedirect()
        );

        // Make request to Spotify
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            urlProperties.getSpotifyAuthBase() + "/api/token",
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
            urlProperties.getSpotifyApiBase() + "/me",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            Map.class
        );
        return userResponse.getBody();
    }

    public List<Track> getRecommendations(String accessToken, String q_string, int offset) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlProperties.getSpotifyApiBase() + "/search");
        builder.queryParam("q", q_string);
        builder.queryParam("type", "track");
        builder.queryParam("limit", 20);
        builder.queryParam("offset", offset);
        String uri = builder.build().toUriString();

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        List<Track> tracks = new ArrayList<>();
        
        if (response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> tracksObj = (Map<String, Object>) responseBody.get("tracks");
            List<Map<String, Object>> items = (List<Map<String, Object>>) tracksObj.get("items");
            
            for (Map<String, Object> item : items) {
                String id = (String) item.get("id");
                String name = (String) item.get("name");
                
                Map<String, Object> album = (Map<String, Object>) item.get("album");
                String albumName = (String) album.get("name");
                
                List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
                String artistName = "Unknown Artist";
                String artistId = "";
                
                if (!artists.isEmpty()) {
                    Map<String, Object> firstArtist = artists.get(0);
                    artistName = (String) firstArtist.get("name");
                    artistId = (String) firstArtist.get("id");
                }
                
                tracks.add(new Track(name, artistName, id, artistId, albumName));
            }
        }

        return tracks;
    }

    public List<Map<String, String>> searchArtists(String accessToken, String artistName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlProperties.getSpotifyApiBase() + "/search");
        builder.queryParam("q", artistName);
        builder.queryParam("type", "artist");
        builder.queryParam("limit", 1);
        String uri = builder.build().toUriString();

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        List<Map<String, String>> artists = new ArrayList<>();
        
        if (response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> artistsObj = (Map<String, Object>) responseBody.get("artists");
            List<Map<String, Object>> items = (List<Map<String, Object>>) artistsObj.get("items");
            
            for (Map<String, Object> item : items) {
                String id = (String) item.get("id");
                String name = (String) item.get("name");
                
                Map<String, String> artist = new HashMap<>();
                artist.put("id", id);
                artist.put("name", name);
                artists.add(artist);
            }
        }

        return artists;
    }
} 