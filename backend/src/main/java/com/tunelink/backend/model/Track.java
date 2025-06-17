package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@MappedSuperclass
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Track {
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String artist;

    @Column(name = "spotify_id", nullable = false)
    private String spotifyId;

    @Column(nullable = false)
    private String album;

    // Constructor for creating from Spotify API response
    public Track(String name, String artist, String spotifyId, String album) {
        this.name = name;
        this.artist = artist;
        this.spotifyId = spotifyId;
        this.album = album;
    }
} 