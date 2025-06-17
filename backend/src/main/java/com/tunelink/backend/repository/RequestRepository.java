package com.tunelink.backend.repository;

import com.tunelink.backend.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByUserIdOrderByTimestampDesc(String userId);
} 