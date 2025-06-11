package com.tunelink.backend.service;

import com.tunelink.backend.model.User;
import com.tunelink.backend.repository.UserRepository;
import com.tunelink.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public User createUser(User user) {
        if (userRepository.existsBySpotifyId(user.getSpotifyId())) {
            throw new UserException("User with Spotify ID already exists");
        }
        
        // Initialize empty lists if they're null
        if (user.getLikedSongs() == null) {
            user.setLikedSongs(new ArrayList<>());
        }
        if (user.getDislikedSongs() == null) {
            user.setDislikedSongs(new ArrayList<>());
        }
        if (user.getRecommendedSongs() == null) {
            user.setRecommendedSongs(new ArrayList<>());
        }
        
        return userRepository.save(user);
    }

    public Optional<User> getUserBySpotifyId(String spotifyId) {
        return userRepository.findBySpotifyId(spotifyId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        if (!userRepository.existsBySpotifyId(user.getSpotifyId())) {
            throw new UserException("User not found");
        }
        return userRepository.save(user);
    }

    public void deleteUser(String spotifyId) {
        if (!userRepository.existsBySpotifyId(spotifyId)) {
            throw new UserException("User not found");
        }
        userRepository.deleteBySpotifyId(spotifyId);
    }
} 