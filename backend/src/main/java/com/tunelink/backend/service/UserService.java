package com.tunelink.backend.service;

import com.tunelink.backend.model.*;
import com.tunelink.backend.repository.*;
import com.tunelink.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final LikedTrackRepository likedTrackRepository;
    private final DislikedTrackRepository dislikedTrackRepository;
    private final RecommendedTrackRepository recommendedTrackRepository;

    @Autowired
    public UserService(
        UserRepository userRepository,
        LikedTrackRepository likedTrackRepository,
        DislikedTrackRepository dislikedTrackRepository,
        RecommendedTrackRepository recommendedTrackRepository
    ) {
        this.userRepository = userRepository;
        this.likedTrackRepository = likedTrackRepository;
        this.dislikedTrackRepository = dislikedTrackRepository;
        this.recommendedTrackRepository = recommendedTrackRepository;
    }

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

    public LikedTrack addLikedTrack(User user, Track track) {
        LikedTrack likedTrack = new LikedTrack(
            track.getName(),
            track.getArtist(),
            track.getSpotifyId(),
            track.getAlbum(),
            user
        );
        return likedTrackRepository.save(likedTrack);
    }

    public DislikedTrack addDislikedTrack(User user, Track track) {
        DislikedTrack dislikedTrack = new DislikedTrack(
            track.getName(),
            track.getArtist(),
            track.getSpotifyId(),
            track.getAlbum(),
            user
        );
        return dislikedTrackRepository.save(dislikedTrack);
    }

    public List<RecommendedTrack> updateRecommendedTracks(User user, List<Track> tracks) {
        // Clear existing recommendations
        recommendedTrackRepository.deleteAll(user.getRecommendedSongs());
        user.getRecommendedSongs().clear();

        // Add new recommendations
        List<RecommendedTrack> recommendedTracks = new ArrayList<>();
        for (Track track : tracks) {
            RecommendedTrack recommendedTrack = new RecommendedTrack(
                track.getName(),
                track.getArtist(),
                track.getSpotifyId(),
                track.getAlbum(),
                user
            );
            recommendedTracks.add(recommendedTrack);
        }
        return recommendedTrackRepository.saveAll(recommendedTracks);
    }
} 