package com.tunelink.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(
    name = "recommended_tracks",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"spotify_id", "user_id"})
    }
)
public class RecommendedTrack extends Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    public RecommendedTrack(String name, String artist, String spotifyId, String album, User user) {
        super(name, artist, spotifyId, album);
        this.user = user;
    }
} 