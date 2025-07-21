package com.vibesbased.backend.repository;

import com.vibesbased.backend.model.LikedTrack;
import com.vibesbased.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikedTrackRepository extends JpaRepository<LikedTrack, Long> {
    Optional<LikedTrack> findBySpotifyId(String spotifyId);
    Optional<LikedTrack> findBySpotifyIdAndUser(String spotifyId, User user);
    List<LikedTrack> findByUser(User user);
    
    @Query("SELECT lt.artist, lt.artistSpotifyId, COUNT(lt) as artistCount " +
           "FROM LikedTrack lt " +
           "WHERE lt.user = :user " +
           "GROUP BY lt.artist, lt.artistSpotifyId " +
           "ORDER BY artistCount DESC")
    List<Object[]> getTopArtistsByUser(User user);
} 