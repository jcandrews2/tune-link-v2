package com.tunelink.backend.controller;

import com.tunelink.backend.model.User;
import com.tunelink.backend.service.UserService;
import com.tunelink.backend.service.OpenAIService;
import com.tunelink.backend.service.SpotifyService;
import com.tunelink.backend.exception.UserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final OpenAIService openAIService;
    private final SpotifyService spotifyService;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserController(UserService userService, OpenAIService openAIService, SpotifyService spotifyService) {
        this.userService = userService;
        this.openAIService = openAIService;
        this.spotifyService = spotifyService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createUser(@PathVariable String userId, @RequestBody Map<String, Object> request) {
        try {
            logger.info("Creating user with User ID: {}", userId);
            
            Map<String, Object> userData = (Map<String, Object>) request.get("user");
            
            User user = new User();
            user.setUserId(userId);
            
            if (userData.get("profilePicture") != null) {
                user.setProfilePicture(userData.get("profilePicture").toString());
            }

            List<String> likedSongs = (List<String>) userData.get("likedSongs");
            List<String> dislikedSongs = (List<String>) userData.get("dislikedSongs");
            List<String> recommendedSongs = (List<String>) userData.get("recommendedSongs");
            
            user.setLikedSongs(likedSongs);
            user.setDislikedSongs(dislikedSongs);
            user.setRecommendedSongs(recommendedSongs);
            
            User createdUser = userService.createUser(user);
            logger.info("Successfully created user with ID: {}", createdUser.getId());
            return ResponseEntity.ok(createdUser);
            
        } catch (UserException e) {
            logger.warn("User creation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating user: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            logger.info("Fetching user with User ID: {}", userId);
            return userService.getUser(userId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching user: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        try {
            logger.info("Updating user with User ID: {}", userId);
            user.setUserId(userId);
            User updatedUser = userService.updateUser(user);
            logger.info("Successfully updated user with ID: {}", updatedUser.getId());
            return ResponseEntity.ok(updatedUser);
        } catch (UserException e) {
            logger.warn("User update failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating user: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            logger.info("Deleting user with User ID: {}", userId);
            userService.deleteUser(userId);
            logger.info("Successfully deleted user with User ID: {}", userId);
            return ResponseEntity.ok().build();
        } catch (UserException e) {
            logger.warn("User deletion failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting user: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @PostMapping("/{userId}/recommendations")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId, @RequestBody Map<String, Object> request) { 
        return userService.getUser(userId)
            .map(user -> {

                // 1. Get natural language request and convert to Spotify parameters
                String userRequest = request.get("request").toString();
                String formattedParameters = openAIService.getRecommendations(userRequest);
                
                // 2. Get recommendations from Spotify
                List<Map<String, Object>> spotifyRecommendations = spotifyService.getRecommendations(
                    user.getSpotifyAccessToken(), 
                    formattedParameters
                );
                
                // 3. Extract track IDs and update user
                List<String> recommendedTrackIds = spotifyRecommendations.stream()
                    .map(track -> (String) track.get("id"))
                    .collect(Collectors.toList());
                
                user.setRecommendedSongs(recommendedTrackIds);
                userService.updateUser(user);
                
                // 4. Return track IDs to frontend
                return ResponseEntity.ok(recommendedTrackIds);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 