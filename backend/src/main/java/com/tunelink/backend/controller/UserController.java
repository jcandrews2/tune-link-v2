package com.tunelink.backend.controller;

import com.tunelink.backend.model.User;
import com.tunelink.backend.service.UserService;
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

    @Autowired
    public UserController(UserService userService, OpenAIService openAIService) {
        this.userService = userService;
        this.openAIService = openAIService;
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
    public ResponseEntity<List<String>> getRecommendations(@PathVariable String userId, @RequestBody String request) {
        User user = userService.getUserByUserId(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            Map<String, Object> recommendationParameters = openAIService.getRecommendationParameters(user, request);
            return ResponseEntity.ok(spotifyService.getRecommendations(user.getSpotifyAccessToken(), recommendationParameters));
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting recommendations.");
        }
    }
} 