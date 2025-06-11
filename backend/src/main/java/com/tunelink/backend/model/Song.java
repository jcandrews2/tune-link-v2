package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String spotifyId;
    private String name;
    private String artist;
    private String album;
    private String imageUrl;
} 