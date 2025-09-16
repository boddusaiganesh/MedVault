// src/main/java/com/medvault/backend/repository/PatientRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.Patient;
import com.medvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.medvault.backend.entity.VerificationStatus;
import java.util.List;


@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // A custom method to find a patient profile by their user login
    Optional<Patient> findByUser(User user);


    List<Patient> findByVerificationStatus(VerificationStatus status);
}