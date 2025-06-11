package com.tunelink.backend.controller;

import com.tunelink.backend.model.User;
import com.tunelink.backend.service.UserService;
import com.tunelink.backend.exception.UserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createUser(@PathVariable String userId, @RequestBody Map<String, Object> request) {
        try {
            logger.info("Creating user with Spotify ID: {}", userId);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> profileData = (Map<String, Object>) request.get("profile");
            
            User user = new User();
            user.setSpotifyId(userId);
            
            // Handle profile picture (it might be nested in the images array)
            if (profileData.get("profilePicture") != null) {
                user.setProfilePicture(profileData.get("profilePicture").toString());
            }
            
            // Initialize empty song lists
            user.setLikedSongs(new ArrayList<>());
            user.setDislikedSongs(new ArrayList<>());
            user.setRecommendedSongs(new ArrayList<>());
            
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
    public ResponseEntity<?> getUserBySpotifyId(@PathVariable String userId) {
        try {
            logger.info("Fetching user with Spotify ID: {}", userId);
            return userService.getUserBySpotifyId(userId)
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
            logger.info("Updating user with Spotify ID: {}", userId);
            user.setSpotifyId(userId);
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
            logger.info("Deleting user with Spotify ID: {}", userId);
            userService.deleteUser(userId);
            logger.info("Successfully deleted user with Spotify ID: {}", userId);
            return ResponseEntity.ok().build();
        } catch (UserException e) {
            logger.warn("User deletion failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting user: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
} 