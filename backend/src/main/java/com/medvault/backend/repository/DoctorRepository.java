// src/main/java/com/medvault/backend/repository/DoctorRepository.java

package com.medvault.backend.repository;

import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.DoctorRating;
import com.medvault.backend.entity.User;
import com.medvault.backend.entity.VerificationStatus; // Import the enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import java.util.List
import java.util.Optional;
import com.medvault.backend.entity.Appointment;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // This method already exists and is correct
    Optional<Doctor> findByUser(User user);
    // --- THE FIX IS HERE: Add this new method ---
    // Spring Data JPA will automatically understand this method name and generate a query:
    // "SELECT * FROM doctors WHERE verification_status = ?"
    List<Doctor> findByVerificationStatus(VerificationStatus status);

        // --- THIS IS THE NEW METHOD YOU NEED TO ADD ---
    // This will generate a "SELECT COUNT..." query for doctors with a specific verification status.
    long countByVerificationStatus(VerificationStatus status);
}