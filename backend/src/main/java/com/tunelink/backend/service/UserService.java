package com.tunelink.backend.service;

import com.tunelink.backend.model.User;
import com.tunelink.backend.repository.UserRepository;
import com.tunelink.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create or update a user after they authenticate with Spotify
    public User createOrUpdateUser(
        String spotifyUserId,
        String accessToken,
        String refreshToken,
        long expiresAt
    ) {
        User user = userRepository.findByUserId(spotifyUserId)
            .orElse(new User());
        
        user.setUserId(spotifyUserId);
        user.setSpotifyAccessToken(accessToken);
        user.setSpotifyRefreshToken(refreshToken);
        user.setSpotifyTokenExpiresAt(expiresAt);
        
        return userRepository.save(user);
    }

    public User getUserByAccessToken(String accessToken) {
        return userRepository.findBySpotifyAccessToken(accessToken)
                .orElse(null);
    }

    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElse(null);
    }

    public User updateUser(User user) {
        if (user.getUserId() == null) {
            throw new UserException("Cannot update user: userId is null");
        }
        
        User existingUser = getUserByUserId(user.getUserId());
        if (existingUser == null) {
            throw new UserException("Cannot update user: user not found with id " + user.getUserId());
        }
        
        user.setId(existingUser.getId());
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        User user = getUserByUserId(userId);
        if (user == null) {
            throw new UserException("User not found with id: " + userId);
        }
        userRepository.delete(user);
    }
} 