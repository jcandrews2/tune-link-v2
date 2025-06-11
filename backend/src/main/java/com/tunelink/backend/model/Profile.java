package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String userId;
    
    private String profilePicture;
    
    @OneToOne(cascade = CascadeType.ALL)
    private Token token;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Song> likedSongs;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Song> dislikedSongs;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<Song> recommendedSongs;

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }
} 