// src/main/java/com/medvault/backend/repository/AppointmentRepository.java

package com.medvault.backend.repository;

import com.medvault.backend.entity.Appointment;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.DoctorAvailabilitySlot;
import com.medvault.backend.entity.Patient;
import com.medvault.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; 

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // --- Simple queries (can be kept for other uses if needed) ---
    List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
    List<Appointment> findByDoctorAndStatusIn(Doctor doctor, List<AppointmentStatus> statuses);

    // --- Robust Query for PATIENT'S "My Appointments" Page ---
    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor WHERE a.patient = :patient ORDER BY a.appointmentDateTime DESC")
    List<Appointment> findByPatientWithDoctorOrderByAppointmentDateTimeDesc(@Param("patient") Patient patient);

    // --- Robust Query for DOCTOR'S "My Schedule" Page (Single Status) ---
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctor = :doctor AND a.status = :status")
    List<Appointment> findByDoctorAndStatusWithPatient(
        @Param("doctor") Doctor doctor, 
        @Param("status") AppointmentStatus status
    );

    // --- Robust Query for DOCTOR'S "My Schedule" Page (Multiple Statuses) ---
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctor = :doctor AND a.status IN :statuses")
    List<Appointment> findByDoctorAndStatusInWithPatient(
        @Param("doctor") Doctor doctor, 
        @Param("statuses") List<AppointmentStatus> statuses
    );

    // --- COUNT Queries for Dashboard Widgets ---
    long countByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
    long countByPatientAndStatusIn(Patient patient, List<AppointmentStatus> statuses);
    Optional<Appointment> findByRescheduledSlot(DoctorAvailabilitySlot rescheduledSlot);
}
