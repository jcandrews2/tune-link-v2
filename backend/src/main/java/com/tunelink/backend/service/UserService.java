package com.tunelink.backend.service;

import com.tunelink.backend.model.User;
import com.tunelink.backend.repository.UserRepository;
import com.tunelink.backend.exception.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        Optional<User> existingUser = userRepository.findByUserId(user.getUserId());
        if (existingUser.isPresent()) {
            throw new UserException("User already exists.");
        }
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.findByUserId(user.getUserId())
            .map(existingUser -> userRepository.save(user))
            .orElseThrow(() -> new UserException("User not found."));
    }

    public void deleteUser(String userId) {
        userRepository.findByUserId(userId)
            .ifPresentOrElse(
                user -> userRepository.deleteByUserId(userId),
                () -> { throw new UserException("User not found."); }
            );
    }

    public Optional<User> getUser(String userId) {
        return userRepository.findByUserId(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
} 