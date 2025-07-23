package com.vibesbased.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.vibesbased.backend.config.UrlProperties;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LastFMService {
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final UrlProperties urlProperties;

    public LastFMService(
        @Value("${LASTFM_API_KEY}") String apiKey,
        UrlProperties urlProperties
    ) {
        this.apiKey = apiKey;
        this.urlProperties = urlProperties;
        this.restTemplate = new RestTemplate();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, String>> getTracksByTag(String tag, int offset) {
        String url = UriComponentsBuilder.fromHttpUrl(urlProperties.getLastfmApiBase())
            .queryParam("method", "tag.gettoptracks")
            .queryParam("tag", tag)
            .queryParam("api_key", apiKey)
            .queryParam("format", "json")
            .queryParam("limit", 20)
            .queryParam("page", (offset / 20) + 1)  // Convert offset to page number (LastFM uses 1-based pages)
            .build()
            .toUriString();

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        List<Map<String, String>> tracks = new ArrayList<>();

        if (response != null && response.containsKey("tracks")) {
            Map<String, Object> tracksData = (Map<String, Object>) response.get("tracks");
            List<Map<String, Object>> trackList = (List<Map<String, Object>>) tracksData.get("track");

            for (Map<String, Object> track : trackList) {
                Map<String, String> trackInfo = Map.of(
                    "name", (String) track.get("name"),
                    "artist", (String) ((Map<String, Object>) track.get("artist")).get("name")
                );
                tracks.add(trackInfo);
            }
        }

        return tracks;
    }
} 