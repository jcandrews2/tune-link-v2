package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tracks")
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String artist;
    
    @Column(unique = true)
    private String spotifyId;
    private String album;

    // Constructor for creating from Spotify API response
    public Track(String name, String artist, String spotifyId, String album) {
        this.name = name;
        this.artist = artist;
        this.spotifyId = spotifyId;
        this.album = album;
    }
} 