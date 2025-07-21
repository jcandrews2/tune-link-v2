package com.vibesbased.backend.model;

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

    @Column(name = "artist_spotify_id", nullable = false)
    private String artistSpotifyId;

    @Column(nullable = false)
    private String album;

    // Constructor for creating from Spotify API response
    public Track(String name, String artist, String spotifyId, String artistSpotifyId, String album) {
        this.name = name;
        this.artist = artist;
        this.spotifyId = spotifyId;
        this.artistSpotifyId = artistSpotifyId;
        this.album = album;
    }
} 