// src/main/java/com/medvault/backend/repository/MedicalRecordRepository.java

package com.medvault.backend.repository;

import com.medvault.backend.entity.MedicalRecord;
import com.medvault.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    // Standard query method
    List<MedicalRecord> findByPatient(Patient patient);

    // Eager-fetches documents to prevent LazyInitializationException
    @Query("SELECT r FROM MedicalRecord r LEFT JOIN FETCH r.documents WHERE r.patient = :patient")
    List<MedicalRecord> findByPatientWithDocuments(@Param("patient") Patient patient);

    // Efficiently counts records for a patient (for dashboard stats)
    long countByPatient(Patient patient);
}