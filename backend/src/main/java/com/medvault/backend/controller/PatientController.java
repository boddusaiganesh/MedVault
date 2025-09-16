// src/main/java/com/medvault/backend/controller/PatientController.java
package com.medvault.backend.controller;

import com.medvault.backend.dto.PatientProfileDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;

import com.medvault.backend.dto.PatientProfileStatusDTO;
import com.medvault.backend.dto.UpdatePatientProfileDTO;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.medvault.backend.dto.CreateRecordRequestDTO;
import com.medvault.backend.dto.DocumentViewDTO;
import com.medvault.backend.dto.RecordViewDTO;
import com.medvault.backend.dto.RescheduleRequestDTO;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;

import com.medvault.backend.dto.AvailableSlotDTO;
import com.medvault.backend.dto.BookAppointmentRequestDTO;
import com.medvault.backend.entity.*;
import com.medvault.backend.repository.*;
import com.medvault.backend.dto.PatientAppointmentViewDTO;

import com.medvault.backend.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;
import com.medvault.backend.dto.SubmitRatingDTO;
import com.medvault.backend.dto.PatientDashboardStatsDTO;
import java.util.Map; 

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilitySlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final FileStorageService fileStorageService;
    private final DoctorRatingRepository ratingRepository;

    @GetMapping("/profile/me")
    public ResponseEntity<PatientProfileDTO> getMyProfile(Principal principal) {
        // Spring Security gives us the logged-in user's email via the Principal
        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        // Map the entity data to a DTO to send to the frontend
        PatientProfileDTO profileDTO = PatientProfileDTO.builder()
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(user.getEmail())
                .dateOfBirth(patient.getDateOfBirth())
                .contactNumber(patient.getContactNumber())
                .gender(patient.getGender())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .build();

        return ResponseEntity.ok(profileDTO);
    }


     @GetMapping("/profile/status")
    public ResponseEntity<PatientProfileStatusDTO> getMyProfileStatus(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();
        return ResponseEntity.ok(new PatientProfileStatusDTO(patient.isProfileComplete()));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdatePatientProfileDTO profileDTO, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        // Update all fields from the DTO
        patient.setFirstName(profileDTO.getFirstName());
        patient.setLastName(profileDTO.getLastName());
        patient.setDateOfBirth(profileDTO.getDateOfBirth());
        patient.setGender(profileDTO.getGender());
        patient.setContactNumber(profileDTO.getContactNumber());
        patient.setAddress(profileDTO.getAddress());
        patient.setEmergencyContact(profileDTO.getEmergencyContact());
        
        // Mark the profile as complete
        patient.setProfileComplete(true);
        
        patientRepository.save(patient);
        return ResponseEntity.ok("Profile updated successfully.");
    }


     // --- NEW: Create a new medical record folder ---
    @PostMapping("/records")
    public ResponseEntity<?> createMedicalRecord(@RequestBody CreateRecordRequestDTO requestDTO, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        MedicalRecord newRecord = MedicalRecord.builder()
                .patient(patient)
                .recordName(requestDTO.getRecordName())
                .recordDate(requestDTO.getRecordDate())
                .build();
        
        medicalRecordRepository.save(newRecord);
        return ResponseEntity.ok("Medical record created successfully.");
    }

    // --- NEW: Get all medical records for the logged-in patient ---
    @GetMapping("/records")
    public ResponseEntity<List<RecordViewDTO>> getMyMedicalRecords(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        List<MedicalRecord> records = medicalRecordRepository.findByPatientWithDocuments(patient);
        
        // Map the entities to DTOs
        List<RecordViewDTO> dtoList = records.stream().map(record -> 
            RecordViewDTO.builder()
                .id(record.getId())
                .recordName(record.getRecordName())
                .recordDate(record.getRecordDate())
                .documents(record.getDocuments().stream().map(doc -> 
                    DocumentViewDTO.builder()
                        .id(doc.getId())
                        .documentName(doc.getDocumentName())
                        .uploadedAt(doc.getUploadedAt())
                        .verificationStatus(doc.getVerificationStatus())
                        .doctorNotes(doc.getDoctorNotes())
                        .build()
                ).toList())
                .build()
        ).toList();

        return ResponseEntity.ok(dtoList);
    }

     // --- NEW: GET A DOCTOR'S AVAILABLE SLOTS ---
    @GetMapping("/doctors/{doctorId}/slots")
    public ResponseEntity<List<AvailableSlotDTO>> getDoctorAvailableSlots(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        List<DoctorAvailabilitySlot> availableSlots = slotRepository.findByDoctorAndIsBooked(doctor, false);

        List<AvailableSlotDTO> dtoList = availableSlots.stream()
                .map(slot -> AvailableSlotDTO.builder()
                        .id(slot.getId())
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .build())
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    // --- NEW: BOOK AN APPOINTMENT ---
    @PostMapping("/appointments/book")
    public ResponseEntity<?> bookAppointment(@RequestBody BookAppointmentRequestDTO request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        DoctorAvailabilitySlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        if (slot.isBooked()) {
            return ResponseEntity.badRequest().body("This slot is no longer available.");
        }
        if (!slot.getDoctor().isProfileComplete() || slot.getDoctor().getVerificationStatus() != VerificationStatus.VERIFIED){
            return ResponseEntity.badRequest().body("This doctor is not currently accepting appointments.");
        }

        // Create the new appointment
        Appointment newAppointment = Appointment.builder()
                .patient(patient)
                .doctor(slot.getDoctor())
                .slot(slot)
                .appointmentDateTime(slot.getStartTime())
                .status(AppointmentStatus.PENDING) // Awaits doctor's approval
                .notes(request.getNotes())
                .build();
        
        // Mark the slot as booked
        slot.setBooked(true);
        slotRepository.save(slot);
        appointmentRepository.save(newAppointment);

        return ResponseEntity.ok("Appointment requested successfully. Please wait for the doctor's approval.");
    }


@GetMapping("/my-appointments")
public ResponseEntity<List<PatientAppointmentViewDTO>> getMySavedAppointments(Principal principal) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    Patient patient = patientRepository.findByUser(user).orElseThrow();

    // This repository call is correct
    List<Appointment> appointments = appointmentRepository.findByPatientWithDoctorOrderByAppointmentDateTimeDesc(patient);

    // --- THE FIX IS IN THIS MAPPING LOGIC ---
    List<PatientAppointmentViewDTO> dtoList = appointments.stream().map(app -> { // 1. Add opening curly brace
        // Check if feedback exists for this specific appointment
        boolean hasFeedback = ratingRepository.findByAppointment(app).isPresent();
        
        // 2. Add the 'return' statement
        return PatientAppointmentViewDTO.builder()
                .id(app.getId())
                .appointmentDateTime(app.getAppointmentDateTime())
                .status(app.getStatus())
                .doctorFirstName(app.getDoctor().getFirstName())
                .doctorLastName(app.getDoctor().getLastName())
                .doctorSpecialization(app.getDoctor().getSpecialization())
                .hasFeedbackBeenSubmitted(hasFeedback)
                .doctorId(app.getDoctor().getId()) // The value is now correctly used
                .build();
    }).toList(); // The .toList() is correct

    return ResponseEntity.ok(dtoList);
}

    @PostMapping("/appointments/{appointmentId}/cancel")
public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId, Principal principal) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    Patient patient = patientRepository.findByUser(user).orElseThrow();
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found."));

    // Security Check: Make sure this patient owns this appointment
    if (!appointment.getPatient().getId().equals(patient.getId())) {
        return ResponseEntity.status(403).body("You are not authorized to cancel this appointment.");
    }

    // Business Rule: Can only cancel pending or approved appointments
    if (appointment.getStatus() != AppointmentStatus.PENDING && appointment.getStatus() != AppointmentStatus.APPROVED) {
        return ResponseEntity.badRequest().body("This appointment can no longer be cancelled.");
    }

    appointment.setStatus(AppointmentStatus.CANCELLED);
    
    // Make the original slot available again
    DoctorAvailabilitySlot slot = appointment.getSlot();
    slot.setBooked(false);
    slotRepository.save(slot);

    appointmentRepository.save(appointment);
    return ResponseEntity.ok("Appointment cancelled successfully.");
}

      // --- NEW ENDPOINT for Patient to upload their Government ID ---
    @PostMapping("/profile/government-id")
    public ResponseEntity<?> uploadGovernmentId(
            @RequestParam("governmentId") MultipartFile governmentIdFile,
            Principal principal) {
        
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        String idFileName = fileStorageService.storeFile(governmentIdFile, user.getEmail());

        patient.setGovernmentIdPath(idFileName);
        patient.setVerificationStatus(VerificationStatus.PENDING_VERIFICATION);
        
        patientRepository.save(patient);

        return ResponseEntity.ok("Government ID uploaded successfully. Awaiting admin verification.");
    }   


     @PostMapping("/appointments/{appointmentId}/feedback")
    public ResponseEntity<?> submitFeedback(
            @PathVariable Long appointmentId,
            @RequestBody SubmitRatingDTO ratingDTO,
            Principal principal) {
        
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found."));

        // --- SECURITY & BUSINESS RULE CHECKS ---
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body("You can only leave feedback for your own appointments.");
        }
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            return ResponseEntity.badRequest().body("You can only leave feedback for completed appointments.");
        }
        // Check if feedback already exists for this appointment
        if (ratingRepository.findByAppointment(appointment).isPresent()) {
            return ResponseEntity.badRequest().body("Feedback has already been submitted for this appointment.");
        }
        
        DoctorRating newRating = DoctorRating.builder()
                .appointment(appointment)
                .patient(patient)
                .doctor(appointment.getDoctor())
                .rating(ratingDTO.getRating())
                .review(ratingDTO.getReview())
                .build();

        ratingRepository.save(newRating);

        return ResponseEntity.ok("Thank you for your feedback!");
    }

     // --- NEW ENDPOINT for the patient dashboard widgets ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<PatientDashboardStatsDTO> getDashboardStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();

        // Calculate the stats
        long upcomingCount = appointmentRepository.countByPatientAndStatusIn(patient, 
            List.of(AppointmentStatus.PENDING, AppointmentStatus.APPROVED));
        long recordsCount = medicalRecordRepository.countByPatient(patient);

        // Build the DTO
        PatientDashboardStatsDTO stats = PatientDashboardStatsDTO.builder()
                .profileComplete(patient.isProfileComplete())
                .upcomingAppointments(upcomingCount)
                .medicalRecordsCount(recordsCount)
                .build();
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/appointments/{appointmentId}/reschedule")
    public ResponseEntity<?> requestReschedule(
            @PathVariable Long appointmentId,
            @RequestBody RescheduleRequestDTO requestDTO,
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        DoctorAvailabilitySlot newSlot = slotRepository.findById(requestDTO.getNewSlotId()).orElseThrow();

        // --- SECURITY & BUSINESS RULE CHECKS ---
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body("You can only reschedule your own appointments.");
        }
        // Business Rule: Can only reschedule an APPROVED appointment.
        if (appointment.getStatus() != AppointmentStatus.APPROVED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only approved appointments can be rescheduled."));
        }
        if (appointment.getAppointmentDateTime().isBefore(LocalDateTime.now().plusHours(24))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Appointments cannot be rescheduled less than 24 hours in advance."));
        }
        if (newSlot.isBooked()) {
            return ResponseEntity.badRequest().body(Map.of("message", "The selected new time slot is no longer available."));
        }

        // Mark the new slot as booked
        newSlot.setBooked(true);
        slotRepository.save(newSlot);
        
        // Update the appointment with the reschedule request
        appointment.setRescheduledSlot(newSlot);
        appointment.setRescheduleStatus(RescheduleStatus.PENDING_APPROVAL);
        appointmentRepository.save(appointment);

        return ResponseEntity.ok("Reschedule request submitted. Please wait for the doctor's approval.");
    }
}