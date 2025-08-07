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

        StringBuilder queryBuilder = new StringBuilder(query != null ? query : "");
        if (filters != null) {
            filters.forEach((key, value) -> {
                if (value != null && !value.isEmpty()) {
                    if (queryBuilder.length() > 0) {
                        queryBuilder.append("+");
                    }
                    if (key.equals("year")) {
                        queryBuilder.append(key).append(":").append(value);
                    } else {
                        queryBuilder.append(key).append(":\"").append(value).append("\"");
                    }
                }
            });
        }

        String searchQuery = queryBuilder.toString().replace(":", "%3A").replace("&", "%26").replace("\"", "%22");

        String baseUrl = urlProperties.getSpotifyApiBase() + "/search";
        String uri = String.format("%s?q=%s&type=%s&market=US&limit=%d&offset=%d",
            baseUrl, searchQuery, type, limit, offset);
        
        logger.info("🎵 Spotify Search URL: {}", uri);
        logger.info("🔍 Search Query: {}", queryBuilder.toString());
        logger.info("📊 Parameters - Limit: {}, Offset: {}", limit, offset);

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
            Map<String, Object> resultsObj = (Map<String, Object>) responseBody.get(type + "s");
            if (resultsObj != null) {
                List<Map<String, Object>> items = (List<Map<String, Object>>) resultsObj.get("items");
                for (Map<String, Object> item : items) {
                    if (type.equals("album")) {
                        // For albums, create a track with the album info
                        String id = (String) item.get("id");
                        String name = (String) item.get("name");
                        List<Map<String, Object>> artists = (List<Map<String, Object>>) item.get("artists");
                        String artistName = artists != null && !artists.isEmpty() ? 
                            (String) artists.get(0).get("name") : "Unknown Artist";
                        String artistId = artists != null && !artists.isEmpty() ? 
                            (String) artists.get(0).get("id") : "";
                        tracks.add(new Track(name, artistName, id, artistId, name));
                    } else {
                        tracks.add(convertToTrack(item));
                    }
                }
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

    public List<Track> getAlbumTracks(String accessToken, String query) {
        // First search for the album with exact name matching
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        // Use exact album name matching in the search query
        String searchQuery = "album:\"" + query.replace("\"", "\\\"") + "\"";
        String uri = String.format("%s/search?q=%s&type=album&market=US&limit=1",
            urlProperties.getSpotifyApiBase(),
            searchQuery.replace(":", "%3A").replace("&", "%26").replace("\"", "%22"));

        logger.info("🎵 Searching for exact album: {}", query);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        if (response.getBody() == null) {
            logger.warn("❌ No response body from Spotify search");
            return new ArrayList<>();
        }

        Map<String, Object> responseBody = response.getBody();
        Map<String, Object> albumsObj = (Map<String, Object>) responseBody.get("albums");
        if (albumsObj == null) {
            logger.warn("❌ No albums object in response");
            return new ArrayList<>();
        }

        List<Map<String, Object>> items = (List<Map<String, Object>>) albumsObj.get("items");
        if (items == null || items.isEmpty()) {
            logger.warn("❌ No albums found matching: {}", query);
            return new ArrayList<>();
        }

        // Find exact match or closest match
        Map<String, Object> albumMatch = null;
        for (Map<String, Object> album : items) {
            String albumName = (String) album.get("name");
            if (albumName.equalsIgnoreCase(query)) {
                albumMatch = album;
                break;
            }
        }

        // If no exact match found, use the first result
        if (albumMatch == null) {
            albumMatch = items.get(0);
        }

        String albumId = (String) albumMatch.get("id");
        String albumName = (String) albumMatch.get("name");
        List<Map<String, Object>> artists = (List<Map<String, Object>>) albumMatch.get("artists");
        String artistName = artists != null && !artists.isEmpty() ? 
            (String) artists.get(0).get("name") : "Unknown Artist";
        String artistId = artists != null && !artists.isEmpty() ? 
            (String) artists.get(0).get("id") : "";

        // Now get the album tracks
        uri = urlProperties.getSpotifyApiBase() + "/albums/" + albumId + "/tracks?limit=50&market=US";
        
        logger.info("🎵 Getting tracks for album: {}", albumName);
        logger.info("🔍 Album ID: {}", albumId);
        logger.info("👤 Artist: {}", artistName);

        response = restTemplate.exchange(
            uri,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );

        List<Track> tracks = new ArrayList<>();
        
        if (response.getBody() != null) {
            responseBody = response.getBody();
            items = (List<Map<String, Object>>) responseBody.get("items");
            for (Map<String, Object> item : items) {
                String trackId = (String) item.get("id");
                String trackName = (String) item.get("name");
                tracks.add(new Track(trackName, artistName, trackId, artistId, albumName));
            }
        }
        return tracks;
    }
} 