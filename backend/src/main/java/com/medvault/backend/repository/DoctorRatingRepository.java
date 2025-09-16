// src/main/java/com/medvault/backend/repository/DoctorRatingRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.DoctorRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.medvault.backend.entity.Appointment; // Import the Appointment entity
import com.medvault.backend.entity.Doctor;

import java.util.Optional; // Import Optional
import com.medvault.backend.entity.Doctor;
import java.util.List;

@Repository
public interface DoctorRatingRepository extends JpaRepository<DoctorRating, Long> {
    // We can add methods to calculate average ratings later
        // --- THIS IS THE NEW METHOD ---
    // Spring Data JPA will automatically generate a query based on this method name.
    // It will look for a DoctorRating record where the 'appointment' field
    // matches the Appointment object that is passed in.
    // We use Optional because the rating might not exist.
    Optional<DoctorRating> findByAppointment(Appointment appointment);
    List<DoctorRating> findByDoctorOrderByCreatedAtDesc(Doctor doctor);
    List<DoctorRating> findAllByOrderByCreatedAtDesc();
}