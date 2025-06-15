package com.tunelink.backend.controller;

import com.tunelink.backend.model.User;
import com.tunelink.backend.model.Track;
import com.tunelink.backend.service.UserService;
import com.tunelink.backend.service.OpenAIService;
import com.tunelink.backend.service.SpotifyService;
import com.tunelink.backend.exception.UserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final OpenAIService openAIService;
    private final SpotifyService spotifyService;

    @Autowired
    public UserController(UserService userService, OpenAIService openAIService, SpotifyService spotifyService) {
        this.userService = userService;
        this.openAIService = openAIService;
        this.spotifyService = spotifyService;
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
        } catch (UserException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId, @RequestBody String request) {
        User user = userService.getUserByUserId(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            Map<String, Object> searchParams = openAIService.getSearchQuery(request);
            String q_string = (String) searchParams.get("q_string");
            int offset = (int) searchParams.get("offset");
            
            List<Track> recommendations = spotifyService.getRecommendations(
                user.getSpotifyAccessToken(), 
                q_string,
                offset
            );

            // Append new recommendations to the existing list
            user.getRecommendedSongs().addAll(recommendations);
            userService.updateUser(user);
            
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) { 
            logger.error("Error getting recommendations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error getting recommendations: " + e.getMessage());
        }
    }
} 