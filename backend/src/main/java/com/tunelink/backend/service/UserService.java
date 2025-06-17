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
import java.util.HashSet;
import java.util.Set;
import java.time.Instant;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final LikedTrackRepository likedTrackRepository;
    private final DislikedTrackRepository dislikedTrackRepository;
    private final RecommendedTrackRepository recommendedTrackRepository;
    private final RequestRepository requestRepository;

    @Autowired
    public UserService(
        UserRepository userRepository,
        LikedTrackRepository likedTrackRepository,
        DislikedTrackRepository dislikedTrackRepository,
        RecommendedTrackRepository recommendedTrackRepository,
        RequestRepository requestRepository
    ) {
        this.userRepository = userRepository;
        this.likedTrackRepository = likedTrackRepository;
        this.dislikedTrackRepository = dislikedTrackRepository;
        this.recommendedTrackRepository = recommendedTrackRepository;
        this.requestRepository = requestRepository;
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
            throw new UserException("Cannot update user: userId is null.");
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
        try {
            // Try to find existing track for this user
            Optional<LikedTrack> existingTrack = likedTrackRepository.findBySpotifyIdAndUser(track.getSpotifyId(), user);
            if (existingTrack.isPresent()) {
                return existingTrack.get();
            }

            LikedTrack likedTrack = new LikedTrack(
                track.getName(),
                track.getArtist(),
                track.getSpotifyId(),
                track.getAlbum(),
                user
            );
            return likedTrackRepository.save(likedTrack);
        } catch (Exception e) {
            // If save fails due to concurrent insert, try to fetch the existing record
            return likedTrackRepository.findBySpotifyIdAndUser(track.getSpotifyId(), user)
                .orElseThrow(() -> new RuntimeException("Failed to add liked track", e));
        }
    }

    public DislikedTrack addDislikedTrack(User user, Track track) {
        try {
            // Try to find existing track for this user
            Optional<DislikedTrack> existingTrack = dislikedTrackRepository.findBySpotifyIdAndUser(track.getSpotifyId(), user);
            if (existingTrack.isPresent()) {
                return existingTrack.get();
            }

            DislikedTrack dislikedTrack = new DislikedTrack(
                track.getName(),
                track.getArtist(),
                track.getSpotifyId(),
                track.getAlbum(),
                user
            );
            return dislikedTrackRepository.save(dislikedTrack);
        } catch (Exception e) {
            // If save fails due to concurrent insert, try to fetch the existing record
            return dislikedTrackRepository.findBySpotifyIdAndUser(track.getSpotifyId(), user)
                .orElseThrow(() -> new RuntimeException("Failed to add disliked track", e));
        }
    }

    public List<RecommendedTrack> updateRecommendedTracks(User user, List<Track> tracks) {
        // Clear existing recommendations
        recommendedTrackRepository.deleteAll(user.getRecommendedSongs());
        user.getRecommendedSongs().clear();

        // Add new recommendations, ensuring no duplicates
        List<RecommendedTrack> recommendedTracks = new ArrayList<>();
        Set<String> addedSpotifyIds = new HashSet<>();

        for (Track track : tracks) {
            if (!addedSpotifyIds.add(track.getSpotifyId())) {
                // Skip if we've already added this track
                continue;
            }

            RecommendedTrack recommendedTrack = new RecommendedTrack(
                track.getName(),
                track.getArtist(),
                track.getSpotifyId(),
                track.getAlbum(),
                user
            );
            recommendedTracks.add(recommendedTrack);
        }
        
        try {
            return recommendedTrackRepository.saveAll(recommendedTracks);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save recommended tracks", e);
        }
    }

    public List<Request> getUserRequests(String userId) {
        return requestRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public void saveRequest(String userId, String text) {
        Request request = new Request();
        request.setUserId(userId);
        request.setText(text);
        request.setTimestamp(Instant.now());
        requestRepository.save(request);
    }
} 