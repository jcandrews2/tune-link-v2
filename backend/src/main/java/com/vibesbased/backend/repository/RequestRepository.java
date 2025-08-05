package com.vibesbased.backend.repository;

import com.vibesbased.backend.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findFirst25ByUserIdOrderByTimestampDesc(String userId);
} 