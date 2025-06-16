package com.tunelink.backend.repository;

import com.tunelink.backend.model.LikedTrack;
import com.tunelink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikedTrackRepository extends JpaRepository<LikedTrack, Long> {
    Optional<LikedTrack> findBySpotifyId(String spotifyId);
    List<LikedTrack> findByUser(User user);
} 