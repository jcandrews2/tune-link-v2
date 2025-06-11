package com.tunelink.model;

import lombok.Data;

@Data
public class Token {
    private String value;
    private Long lastRefreshed;
} 