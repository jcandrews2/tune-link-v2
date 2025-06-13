package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String userId;

    private String profilePicture;
    
    private String spotifyAccessToken;
    private String spotifyRefreshToken;
    private Long spotifyTokenExpiresAt;

    @ElementCollection
    private List<String> likedSongs;

    @ElementCollection
    private List<String> dislikedSongs;

    @ElementCollection
    private List<String> recommendedSongs;
} 