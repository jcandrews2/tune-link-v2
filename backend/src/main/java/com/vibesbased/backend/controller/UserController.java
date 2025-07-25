package com.vibesbased.backend.controller;

import com.vibesbased.backend.model.*;
import com.vibesbased.backend.service.UserService;
import com.vibesbased.backend.service.OpenAIService;
import com.vibesbased.backend.service.SpotifyService;
import com.vibesbased.backend.service.LastFMService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Random;
import java.util.HashMap;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final OpenAIService openAIService;
    private final SpotifyService spotifyService;
    private final LastFMService lastFMService;
    private final Random random = new Random();

    @Autowired
    public UserController(UserService userService, OpenAIService openAIService, SpotifyService spotifyService, LastFMService lastFMService) {
        this.userService = userService;
        this.openAIService = openAIService;
        this.spotifyService = spotifyService;
        this.lastFMService = lastFMService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue("access_token") String token) {
        User user = userService.getUserByAccessToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in.");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User user) {
        User oldUser = userService.getUserByUserId(userId);
        if (oldUser == null) { 
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/recommendations")
    @Transactional
    public ResponseEntity<?> getRecommendations(@PathVariable String userId, @RequestBody String request) {
        User user = userService.getUserByUserId(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            Map<String, Object> searchParams = openAIService.getSearchQuery(request);
            String endpoint = (String) searchParams.get("endpoint");
            List<Track> recommendations;

            if ("lastfm".equals(endpoint)) {
                String tag = (String) searchParams.get("tag");
                List<Map<String, String>> lastFmTracks = lastFMService.getTracksByTag(tag, random.nextInt(51));
                recommendations = new ArrayList<>();
                for (Map<String, String> track : lastFmTracks) {
                    String query = track.get("artist") + " " + track.get("name");
                    List<Track> spotifyTracks = spotifyService.search(
                        user.getSpotifyAccessToken(),
                        query,
                        "track",
                        new HashMap<>(),
                        1,
                        0
                    );
                    if (!spotifyTracks.isEmpty()) {
                        recommendations.add(spotifyTracks.get(0));
                    }
                }
            } else {
                String query = (String) searchParams.get("query");
                String type = (String) searchParams.get("type");
                String year = (String) searchParams.get("year");
                
                Map<String, String> filters = new HashMap<>();
                if (year != null && !year.isEmpty()) {
                    filters.put("year", year);
                }
                
                recommendations = spotifyService.search(
                    user.getSpotifyAccessToken(),
                    query,
                    type != null ? type : "track",
                    filters,
                    20,
                    0
                );
            }

            List<RecommendedTrack> savedTracks = userService.updateRecommendedTracks(user, recommendations);
            return ResponseEntity.ok(savedTracks);
            
        } catch (Exception e) { 
            logger.error("Error getting recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error getting recommendations: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/likes")
    public ResponseEntity<?> likeTrack(@PathVariable String userId, @RequestBody Track track) {
        User user = userService.getUserByUserId(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        userService.addLikedTrack(user, track);
        return ResponseEntity.ok().body("Track liked successfully");
    }

    @PostMapping("/{userId}/dislikes")
    public ResponseEntity<?> dislikeTrack(@PathVariable String userId, @RequestBody Track track) {
        User user = userService.getUserByUserId(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        userService.addDislikedTrack(user, track);
        return ResponseEntity.ok().body("Track disliked successfully");
    }

    @GetMapping("/{userId}/requests")
    public ResponseEntity<List<Request>> getUserRequests(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserRequests(userId));
    }

    @PostMapping("/{userId}/requests")
    public ResponseEntity<Void> saveRequest(@PathVariable String userId, @RequestBody Map<String, Object> requestBody) {
        String request = (String) requestBody.get("request");
        
        userService.saveRequest(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/likes")
    public ResponseEntity<List<Track>> getLikedTracks(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getLikedTracks(userId));
    }

    @GetMapping("/{userId}/dislikes")
    public ResponseEntity<List<Track>> getDislikedTracks(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getDislikedTracks(userId));
    }

    @GetMapping("/{userId}/artists")
    public ResponseEntity<List<Map<String, String>>> getArtists(@PathVariable String userId) { 
        return ResponseEntity.ok(userService.getTopArtists(userId));
    }
} 