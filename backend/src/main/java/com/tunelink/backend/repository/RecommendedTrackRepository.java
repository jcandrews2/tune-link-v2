package com.tunelink.backend.repository;

import com.tunelink.backend.model.RecommendedTrack;
import com.tunelink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendedTrackRepository extends JpaRepository<RecommendedTrack, Long> {
    Optional<RecommendedTrack> findBySpotifyId(String spotifyId);
    List<RecommendedTrack> findByUser(User user);
} 