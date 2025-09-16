// src/main/java/com/medvault/backend/entity/Appointment.java
package com.medvault.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private DoctorAvailabilitySlot slot;
    
    @Column(name = "appointment_datetime", nullable = false)
    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String notes; // Patient's reason for visit

        // --- NEW FIELDS for Rescheduling ---
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rescheduled_slot_id") // Can be null
    private DoctorAvailabilitySlot rescheduledSlot;

    @Enumerated(EnumType.STRING)
    @Column(name = "reschedule_status") // Can be null
    private RescheduleStatus rescheduleStatus;
}
