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
    private String spotifyId;

    private String profilePicture;

    @ElementCollection
    private List<String> likedSongs;

    @ElementCollection
    private List<String> dislikedSongs;

    @ElementCollection
    private List<String> recommendedSongs;

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return spotifyId;
    }
} 