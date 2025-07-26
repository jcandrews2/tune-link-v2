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
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedCredentials);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = String.format(
            "code=%s&redirect_uri=%s&grant_type=authorization_code",
            code, urlProperties.getSpotifyAuthRedirect()
        );

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

    public List<Track> search(String accessToken, String query, String type, Map<String, String> filters, int limit, int offset) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        if (type == null || type.trim().isEmpty()) {
            type = "track"; 
        }
        type = type.toLowerCase().trim(); 

        StringBuilder queryBuilder = new StringBuilder(query != null ? query : "");
        if (filters != null) {
            filters.forEach((key, value) -> {
                if (value != null && !value.isEmpty()) {
                    queryBuilder.append(" ").append(key).append(":").append(value);
                }
            });
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(urlProperties.getSpotifyApiBase() + "/search")
            .queryParam("q", queryBuilder.toString())
            .queryParam("type", type)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .queryParam("market", "US");

        String uri = builder.build().toUriString();
        logger.debug("Spotify search URI: {}", uri);

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
            
            if (type.equals("track")) {
                Map<String, Object> tracksObj = (Map<String, Object>) responseBody.get("tracks");
                List<Map<String, Object>> items = (List<Map<String, Object>>) tracksObj.get("items");
                for (Map<String, Object> item : items) {
                    tracks.add(convertToTrack(item));
                }
            } else if (type.equals("album")) {
                Map<String, Object> albumsObj = (Map<String, Object>) responseBody.get("albums");
                List<Map<String, Object>> items = (List<Map<String, Object>>) albumsObj.get("items");
                if (!items.isEmpty()) {
                    String albumId = (String) items.get(0).get("id");
                    tracks.addAll(getAlbumTracksById(accessToken, albumId));
                }
            } else if (type.equals("artist")) {
                Map<String, Object> artistsObj = (Map<String, Object>) responseBody.get("artists");
                List<Map<String, Object>> items = (List<Map<String, Object>>) artistsObj.get("items");
                if (!items.isEmpty()) {
                    String artistId = (String) items.get(0).get("id");
                    tracks.addAll(getArtistTracksById(accessToken, artistId));
                }
            }
        }

        return tracks;
    }

    private List<Track> getAlbumTracksById(String accessToken, String albumId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        String uri = urlProperties.getSpotifyApiBase() + "/albums/" + albumId + "/tracks?limit=50&market=US";
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        List<Track> tracks = new ArrayList<>();
        
        if (response.getBody() != null) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");
            for (Map<String, Object> item : items) {
                tracks.add(convertToTrack(item));
            }
        }

        return tracks;
    }

    private List<Track> getArtistTracksById(String accessToken, String artistId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        String uri = urlProperties.getSpotifyApiBase() + "/artists/" + artistId + "/top-tracks?market=US";
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        List<Track> tracks = new ArrayList<>();
        
        if (response.getBody() != null) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("tracks");
            for (Map<String, Object> item : items) {
                tracks.add(convertToTrack(item));
            }
        }

        return tracks;
    }

    private Track convertToTrack(Map<String, Object> item) {
        String id = (String) item.get("id");
        String name = (String) item.get("name");
        
        Map<String, Object> album = (Map<String, Object>) item.get("album");
        String albumName = album != null ? (String) album.get("name") : "";
        
        List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
        String artistName = "Unknown Artist";
        String artistId = "";
        
        if (!artists.isEmpty()) {
            Map<String, Object> firstArtist = artists.get(0);
            artistName = (String) firstArtist.get("name");
            artistId = (String) firstArtist.get("id");
        }
        
        return new Track(name, artistName, id, artistId, albumName);
    }
} 