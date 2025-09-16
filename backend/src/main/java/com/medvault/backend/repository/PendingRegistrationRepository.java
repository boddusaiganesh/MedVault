// src/main/java/com/medvault/backend/repository/PendingRegistrationRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.PendingRegistration;
import com.medvault.backend.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import com.medvault.backend.entity.Role;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {
    // Find all requests with a specific status (e.g., PENDING)
    List<PendingRegistration> findByStatus(RegistrationStatus status);
    List<PendingRegistration> findByStatusAndRequestedRole(RegistrationStatus status, Role requestedRole);
    
    // Check if a registration request with this email already exists
    Optional<PendingRegistration> findByEmail(String email);

        // --- THIS IS THE NEW METHOD YOU NEED TO ADD ---
    // Spring Data JPA will automatically create a "SELECT COUNT..." query from this method name.
    long countByStatusAndRequestedRole(RegistrationStatus status, Role requestedRole);
}