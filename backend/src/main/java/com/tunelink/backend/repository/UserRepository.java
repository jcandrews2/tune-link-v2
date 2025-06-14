package com.tunelink.backend.repository;

import com.tunelink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySpotifyAccessToken(String accessToken);
    Optional<User> findByUserId(String userId);
} 