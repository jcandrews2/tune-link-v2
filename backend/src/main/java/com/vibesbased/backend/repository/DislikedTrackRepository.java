package com.vibesbased.backend.repository;

import com.vibesbased.backend.model.DislikedTrack;
import com.vibesbased.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DislikedTrackRepository extends JpaRepository<DislikedTrack, Long> {
    Optional<DislikedTrack> findBySpotifyId(String spotifyId);
    Optional<DislikedTrack> findBySpotifyIdAndUser(String spotifyId, User user);
    List<DislikedTrack> findByUser(User user);
} 