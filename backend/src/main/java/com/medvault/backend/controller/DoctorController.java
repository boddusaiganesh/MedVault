// src/main/java/com/medvault/backend/controller/DoctorController.java

package com.medvault.backend.controller;

import com.medvault.backend.dto.CreateSlotRequestDTO;
import com.medvault.backend.dto.DoctorProfileDTO;
import com.medvault.backend.dto.DoctorProfileStatusDTO;
import com.medvault.backend.dto.UpdateDoctorProfileDTO;
import com.medvault.backend.entity.Appointment;
import com.medvault.backend.entity.AppointmentStatus;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.DoctorAvailabilitySlot;
import com.medvault.backend.entity.DoctorRating;
import com.medvault.backend.entity.User;
import com.medvault.backend.entity.VerificationStatus;
import com.medvault.backend.repository.AppointmentRepository; // Needed import
import com.medvault.backend.repository.DoctorAvailabilitySlotRepository; // Needed import
import com.medvault.backend.repository.DoctorRatingRepository;
import com.medvault.backend.repository.DoctorRepository;
import com.medvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;


import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List; // THE FIX: Import java.util.List
import com.medvault.backend.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import com.medvault.backend.entity.MedicalDocument;
import com.medvault.backend.entity.RescheduleStatus;
import com.medvault.backend.repository.MedicalDocumentRepository;
import com.medvault.backend.dto.AppointmentRequestViewDTO; // Import the new DTO
import com.medvault.backend.dto.DoctorDashboardStatsDTO;
import com.medvault.backend.dto.DoctorReviewViewDTO;

import java.util.EnumSet;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    // --- THE FIX: All required repositories are now declared as final fields ---
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilitySlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final FileStorageService fileStorageService; // THIS IS THE FIX
    private final MedicalDocumentRepository medicalDocumentRepository;
    private final DoctorRatingRepository ratingRepository;

    @GetMapping("/profile/me")
    public ResponseEntity<DoctorProfileDTO> getMyProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        DoctorProfileDTO profileDTO = DoctorProfileDTO.builder()
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(user.getEmail())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .contactNumber(doctor.getContactNumber()) // THE FIX: Add this line
                .build();
        return ResponseEntity.ok(profileDTO);
    }
    
    @GetMapping("/profile/status")
    public ResponseEntity<DoctorProfileStatusDTO> getMyProfileStatus(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
        return ResponseEntity.ok(new DoctorProfileStatusDTO(doctor.isProfileComplete()));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody UpdateDoctorProfileDTO profileDTO, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();

        doctor.setFirstName(profileDTO.getFirstName());
        doctor.setLastName(profileDTO.getLastName());
        doctor.setSpecialization(profileDTO.getSpecialization());
        doctor.setQualification(profileDTO.getQualification());
        doctor.setContactNumber(profileDTO.getContactNumber());
        doctor.setExperienceYears(profileDTO.getExperienceYears());
        doctor.setProfileComplete(true);
        
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Profile updated successfully.");
    }

    @PostMapping("/slots")
    public ResponseEntity<?> createAvailabilitySlots(@RequestBody CreateSlotRequestDTO request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();

        if (!doctor.isProfileComplete()) {
            return ResponseEntity.badRequest().body("Please complete your profile before creating slots.");
        }

        if (doctor.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return ResponseEntity.badRequest().body("Your account is not verified. You cannot create slots.");
        }

        LocalDateTime currentSlotStart = request.getStartTime();
        while (currentSlotStart.isBefore(request.getEndTime())) {
            LocalDateTime currentSlotEnd = currentSlotStart.plusMinutes(request.getSlotDurationMinutes());
            if (currentSlotEnd.isAfter(request.getEndTime())) {
                break;
            }

            DoctorAvailabilitySlot newSlot = DoctorAvailabilitySlot.builder()
                    .doctor(doctor)
                    .startTime(currentSlotStart)
                    .endTime(currentSlotEnd)
                    .isBooked(false)
                    .build();
            slotRepository.save(newSlot);
            currentSlotStart = currentSlotEnd;
        }
        return ResponseEntity.ok("Availability slots created successfully.");
    }



    @PostMapping("/appointments/{appointmentId}/approve")
    public ResponseEntity<?> approveAppointment(@PathVariable Long appointmentId, Principal principal) {
        // Simple security check: Ensure the appointment belongs to the logged-in doctor
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to approve this appointment.");
        }

        appointment.setStatus(AppointmentStatus.APPROVED);
        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Appointment approved.");
    }

    @PostMapping("/appointments/{appointmentId}/reject")
    public ResponseEntity<?> rejectAppointment(@PathVariable Long appointmentId, Principal principal) {
        // Simple security check
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to reject this appointment.");
        }

        appointment.setStatus(AppointmentStatus.REJECTED);
        
        DoctorAvailabilitySlot slot = appointment.getSlot();
        slot.setBooked(false);
        slotRepository.save(slot);

        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Appointment rejected and slot has been made available.");
    }


     @PostMapping("/profile/documents")
    public ResponseEntity<?> uploadDocuments(
            @RequestParam("medicalDegree") MultipartFile medicalDegreeFile,
            @RequestParam("medicalLicense") MultipartFile medicalLicenseFile,
            Principal principal) {
        
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();

        // Store the files and get their new names
        String degreeFileName = fileStorageService.storeFile(medicalDegreeFile, user.getEmail());
        String licenseFileName = fileStorageService.storeFile(medicalLicenseFile, user.getEmail());

        // Save the file paths to the doctor's profile
        doctor.setMedicalDegreePath(degreeFileName);
        doctor.setMedicalLicensePath(licenseFileName);
        doctor.setVerificationStatus(VerificationStatus.PENDING_VERIFICATION);
                
        doctorRepository.save(doctor);

        return ResponseEntity.ok("Documents uploaded successfully. Awaiting admin verification.");
    }

    
    // --- NEW: Verify a medical document ---
    @PostMapping("/documents/{documentId}/verify")
    public ResponseEntity<?> verifyDocument(@PathVariable Long documentId) {
        MedicalDocument doc = medicalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        doc.setVerificationStatus(VerificationStatus.VERIFIED);
        // In a real app, you might also link the verifying doctor's ID here
        
        medicalDocumentRepository.save(doc);
        return ResponseEntity.ok("Document marked as verified.");
    }

    // --- NEW: Reject a medical document (request correction) ---
    @PostMapping("/documents/{documentId}/reject")
    public ResponseEntity<?> rejectDocument(@PathVariable Long documentId, @RequestBody(required = false) String notes) {
        MedicalDocument doc = medicalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found."));

        doc.setVerificationStatus(VerificationStatus.NEEDS_CORRECTION);
        doc.setDoctorNotes(notes); // Save the reason for rejection

        medicalDocumentRepository.save(doc);
        return ResponseEntity.ok("Document marked as needing correction.");
    }

     // --- UPDATED ENDPOINT: From requests to a full schedule view ---
@GetMapping("/my-appointments")
public ResponseEntity<List<AppointmentRequestViewDTO>> getMyAppointments(Principal principal, @RequestParam(name = "status", required = false) String status) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
    
    List<Appointment> appointments;
    if (status != null && !status.isEmpty()) {
        appointments = appointmentRepository.findByDoctorAndStatusWithPatient(doctor, AppointmentStatus.valueOf(status.toUpperCase()));
    } else {
        appointments = appointmentRepository.findByDoctorAndStatusInWithPatient(doctor, 
            List.of(AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.COMPLETED));
    }

    // --- THE FIX IS IN THIS MAPPING LOGIC ---
    List<AppointmentRequestViewDTO> dtoList = appointments.stream()
            .map(appointment -> { // 1. Add opening curly brace
                // This logic is to safely get the rescheduled time only if it exists
                LocalDateTime newTime = (appointment.getRescheduledSlot() != null)
                        ? appointment.getRescheduledSlot().getStartTime()
                        : null;

                // 2. Add the 'return' statement
                return AppointmentRequestViewDTO.builder()
                        .id(appointment.getId())
                        .appointmentDateTime(appointment.getAppointmentDateTime())
                        .status(appointment.getStatus())
                        .notes(appointment.getNotes())
                        .patientFirstName(appointment.getPatient().getFirstName())
                        .patientLastName(appointment.getPatient().getLastName())
                        .rescheduleStatus(appointment.getRescheduleStatus())
                        .newlyRequestedTime(newTime)
                        .build();
            }) // End parenthesis for map
            .toList();

    return ResponseEntity.ok(dtoList);
}

         // --- NEW ENDPOINT: Mark appointment as completed ---
            @PostMapping("/appointments/{appointmentId}/complete")
            public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId, Principal principal) {
                User user = userRepository.findByEmail(principal.getName()).orElseThrow();
                Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
                Appointment appointment = appointmentRepository.findById(appointmentId)
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));

                if (!appointment.getDoctor().getId().equals(doctor.getId())) {
                    return ResponseEntity.status(403).body("You are not authorized to modify this appointment.");
                }

                // --- THIS IS THE ADDED BUSINESS RULE ---
                // You can only complete an appointment that has been approved.
                if (appointment.getStatus() != AppointmentStatus.APPROVED) {
                    return ResponseEntity.badRequest().body("This appointment cannot be marked as completed because it is not in an 'APPROVED' state.");
                }

                appointment.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(appointment);
                return ResponseEntity.ok("Appointment marked as completed.");
            }

         // --- NEW ENDPOINT for doctor dashboard widgets ---
        @GetMapping("/dashboard/stats")
        public ResponseEntity<DoctorDashboardStatsDTO> getDashboardStats(Principal principal) {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            Doctor doctor = doctorRepository.findByUser(user).orElseThrow();

            long pendingRequests = appointmentRepository.countByDoctorAndStatus(doctor, AppointmentStatus.PENDING);
            long upcomingAppointments = appointmentRepository.countByDoctorAndStatus(doctor, AppointmentStatus.APPROVED);

            DoctorDashboardStatsDTO stats = DoctorDashboardStatsDTO.builder()
                    .profileComplete(doctor.isProfileComplete())
                    .verificationStatus(doctor.getVerificationStatus().name())
                    .pendingAppointmentRequests(pendingRequests)
                    .upcomingAppointments(upcomingAppointments)
                    .build();
            
            return ResponseEntity.ok(stats);
    }

    // --- NEW ENDPOINT: Get all reviews for the logged-in doctor ---
    @GetMapping("/my-reviews")
    public ResponseEntity<List<DoctorReviewViewDTO>> getMyReviews(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();

        List<DoctorRating> ratings = ratingRepository.findByDoctorOrderByCreatedAtDesc(doctor);

        // Map to the DTO to send clean data to the frontend
        List<DoctorReviewViewDTO> dtoList = ratings.stream()
                .map(rating -> DoctorReviewViewDTO.builder()
                        .id(rating.getId())
                        .rating(rating.getRating())
                        .review(rating.getReview())
                        .createdAt(rating.getCreatedAt())
                        .patientFirstName(rating.getPatient().getFirstName())
                        // Note: This relies on a lazy load. For robustness, a JOIN FETCH
                        // could be added to the repository method if needed.
                        .build())
                .toList();
        
        return ResponseEntity.ok(dtoList);
    }


     // --- NEW ENDPOINT: Approve a reschedule request ---
    @PostMapping("/appointments/{appointmentId}/reschedule/approve")
    public ResponseEntity<?> approveReschedule(@PathVariable Long appointmentId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Security Check: Ensure the appointment belongs to the logged-in doctor
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to modify this appointment.");
        }
        
        // Business Rule Check: Ensure there is a pending reschedule request
        if (appointment.getRescheduleStatus() != RescheduleStatus.PENDING_APPROVAL || appointment.getRescheduledSlot() == null) {
            return ResponseEntity.badRequest().body("No pending reschedule request found for this appointment.");
        }

        // Make the original slot available again
        DoctorAvailabilitySlot oldSlot = appointment.getSlot();
        oldSlot.setBooked(false);
        slotRepository.save(oldSlot);

        // Update the appointment to use the new slot
        appointment.setSlot(appointment.getRescheduledSlot());
        appointment.setAppointmentDateTime(appointment.getRescheduledSlot().getStartTime());
        
        // Clear the reschedule request fields and mark as approved
        appointment.setRescheduledSlot(null);
        appointment.setRescheduleStatus(RescheduleStatus.APPROVED);

        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Reschedule approved. The appointment has been updated to the new time.");
    }

    // --- NEW ENDPOINT: Reject a reschedule request ---
    @PostMapping("/appointments/{appointmentId}/reschedule/reject")
    public ResponseEntity<?> rejectReschedule(@PathVariable Long appointmentId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctorRepository.findByUser(user).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Security Check
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to modify this appointment.");
        }
        
        // Business Rule Check
        if (appointment.getRescheduleStatus() != RescheduleStatus.PENDING_APPROVAL || appointment.getRescheduledSlot() == null) {
            return ResponseEntity.badRequest().body("No pending reschedule request found for this appointment.");
        }

        // Make the newly requested slot (that was temporarily booked) available again
        DoctorAvailabilitySlot requestedSlot = appointment.getRescheduledSlot();
        requestedSlot.setBooked(false);
        slotRepository.save(requestedSlot);

        // Clear the reschedule request fields and mark as rejected
        appointment.setRescheduledSlot(null);
        appointment.setRescheduleStatus(RescheduleStatus.REJECTED);
        
        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Reschedule request rejected. The original appointment time remains.");
    }
}       