package com.tunelink.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Song {
    @Id
    private String songId;
    private String name;
    private String artist;
} 