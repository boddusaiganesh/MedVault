package com.medvault.backend.repository;

import com.medvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This method allows us to find a user by their email address
    Optional<User> findByEmail(String email);
}