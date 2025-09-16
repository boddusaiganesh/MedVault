// src/main/java/com/medvault/backend/controller/AdminController.java

package com.medvault.backend.controller;

import com.medvault.backend.dto.CreateUserRequestDTO;
import com.medvault.backend.dto.PendingRegistrationViewDTO;
import com.medvault.backend.entity.Patient;
import com.medvault.backend.entity.PendingRegistration;
import com.medvault.backend.entity.RegistrationStatus;
import com.medvault.backend.entity.Role; 
import com.medvault.backend.entity.User;
import com.medvault.backend.entity.VerificationStatus;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.repository.DoctorRatingRepository;
import com.medvault.backend.repository.DoctorRepository;

import com.medvault.backend.repository.PatientRepository;
import com.medvault.backend.repository.PendingRegistrationRepository;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam; // Add this import

import java.security.SecureRandom;

import java.util.Base64;
import java.util.List;
import com.medvault.backend.dto.DoctorVerificationDTO; // Import the new DTO
import com.medvault.backend.dto.DashboardStatsDTO;
import com.medvault.backend.dto.PatientVerificationDTO;
import com.medvault.backend.dto.UserListViewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.medvault.backend.dto.AdminReviewViewDTO;
import com.medvault.backend.entity.DoctorRating;
import org.springframework.web.bind.annotation.DeleteMapping;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final DoctorRatingRepository ratingRepository; // Inject the rating repo

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequestDTO requestDTO) {
       
        if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

     
        String tempPassword = generateRandomPassword();

    
        User newUser = User.builder()
                .name(requestDTO.getName())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(tempPassword))
                .role(requestDTO.getRole())
                .isFirstLogin(true)
                .build();

        User savedUser = userRepository.save(newUser);

       
        if (savedUser.getRole() == Role.ROLE_USER) {
        
            Patient newPatientProfile = Patient.builder()
                    .user(savedUser) 
                    .firstName(savedUser.getName()) 
                    .lastName("")
                   
                    .build();
            
            
            patientRepository.save(newPatientProfile);
            
        }        else if (savedUser.getRole() == Role.ROLE_DOCTOR) {
            Doctor newDoctorProfile = Doctor.builder()
                    .user(savedUser)
                    .firstName(savedUser.getName())
                    .lastName("")
                    .build();
            doctorRepository.save(newDoctorProfile);
        }

       
        emailService.sendTemporaryPasswordEmail(savedUser.getEmail(), savedUser.getUsername(), tempPassword);

        return ResponseEntity.ok("User registered successfully! Temporary password sent to email.");
    }

    
    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[12];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

     @GetMapping("/registrations/pending")
    public ResponseEntity<List<PendingRegistrationViewDTO>> getPendingRegistrations(@RequestParam("role") Role requestedRole) {
       
        List<PendingRegistration> pendingList = pendingRegistrationRepository.findByStatusAndRequestedRole(RegistrationStatus.PENDING, requestedRole);        
        // Map to a simpler DTO to send to the frontend
        List<PendingRegistrationViewDTO> dtoList = pendingList.stream()
                .map(req -> PendingRegistrationViewDTO.builder()
                        .id(req.getId())
                        .name(req.getName())
                        .email(req.getEmail())
                        .requestedRole(req.getRequestedRole())
                        .build())
                .toList();
        
        return ResponseEntity.ok(dtoList);
    }

    // --- NEW ENDPOINT: Approve a registration request ---
    @PostMapping("/registrations/approve/{id}")
    public ResponseEntity<?> approveRegistration(@PathVariable Long id) {
        PendingRegistration request = pendingRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));

        // Use our existing createUser method's logic!
        CreateUserRequestDTO userRequest = new CreateUserRequestDTO();
        userRequest.setName(request.getName());
        userRequest.setEmail(request.getEmail());
        userRequest.setRole(request.getRequestedRole());
        
        // This re-uses the exact same logic we already built and tested
        ResponseEntity<?> creationResponse = createUser(userRequest);
        
        // If user creation was successful, update the request status
        if (creationResponse.getStatusCode().is2xxSuccessful()) {
            request.setStatus(RegistrationStatus.APPROVED);
            pendingRegistrationRepository.save(request);
            return ResponseEntity.ok("User approved and created successfully.");
        } else {
            // Pass on the error message from createUser (e.g., "email already exists")
            return creationResponse;
        }
    }

    @GetMapping("/doctors/pending-verification")
     public ResponseEntity<List<DoctorVerificationDTO>> getDoctorsPendingVerification() {
        List<Doctor> doctors = doctorRepository.findByVerificationStatus(VerificationStatus.PENDING_VERIFICATION);

        // Manually map the List<Doctor> to a List<DoctorVerificationDTO>
        List<DoctorVerificationDTO> dtoList = doctors.stream()
                .map(doctor -> DoctorVerificationDTO.builder()
                        .id(doctor.getId())
                        .firstName(doctor.getFirstName())
                        .lastName(doctor.getLastName())
                        .specialization(doctor.getSpecialization())
                        .qualification(doctor.getQualification())
                        .verificationStatus(doctor.getVerificationStatus())
                        // This is the key: we explicitly access the User to get the email
                        // This "wakes up" the lazy-loaded object safely on the backend.
                        .userEmail(doctor.getUser().getEmail()) 
                        .build())
                .toList();

        return ResponseEntity.ok(dtoList);
    }
    
    @PostMapping("/doctors/{doctorId}/verify")
    public ResponseEntity<?> verifyDoctor(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setVerificationStatus(VerificationStatus.VERIFIED);
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor verification approved.");
    }
    

        // --- NEW ENDPOINT for dashboard widgets ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        long patientRequests = pendingRegistrationRepository.countByStatusAndRequestedRole(RegistrationStatus.PENDING, Role.ROLE_USER);
        long doctorRequests = pendingRegistrationRepository.countByStatusAndRequestedRole(RegistrationStatus.PENDING, Role.ROLE_DOCTOR);
        long doctorVerifications = doctorRepository.countByVerificationStatus(VerificationStatus.PENDING_VERIFICATION);

            long totalPatientsCount = patientRepository.count();
            long totalDoctorsCount = doctorRepository.count();
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .pendingPatientRequests(patientRequests)
                .pendingDoctorRequests(doctorRequests)
                .pendingDoctorVerifications(doctorVerifications)
                .totalPatients(totalPatientsCount) // Add to builder
                .totalDoctors(totalDoctorsCount)   // Add to builder
                .build();
        
        return ResponseEntity.ok(stats);
    }

      // --- NEW ENDPOINT: Get patients pending ID verification ---
    @GetMapping("/patients/pending-verification")
    public ResponseEntity<List<PatientVerificationDTO>> getPatientsPendingVerification() {
        List<Patient> patients = patientRepository.findByVerificationStatus(VerificationStatus.PENDING_VERIFICATION);
        
        // Map to DTO to prevent lazy loading issues and send clean data
        List<PatientVerificationDTO> dtoList = patients.stream()
                .map(patient -> PatientVerificationDTO.builder()
                        .id(patient.getId())
                        .firstName(patient.getFirstName())
                        .lastName(patient.getLastName())
                        .userEmail(patient.getUser().getEmail())
                        .verificationStatus(patient.getVerificationStatus())
                        .build())
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    // --- NEW ENDPOINT: Approve a patient's ID ---
    @PostMapping("/patients/{patientId}/verify")
    public ResponseEntity<?> verifyPatient(@PathVariable Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setVerificationStatus(VerificationStatus.VERIFIED);
        patientRepository.save(patient);
        return ResponseEntity.ok("Patient ID verification approved.");
    }

     // --- NEW ENDPOINT: Get a paginated list of all patients ---
    @GetMapping("/patients")
    public ResponseEntity<Page<UserListViewDTO>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());
        
        Page<Patient> patientPage = patientRepository.findAll(paging);
        
        Page<UserListViewDTO> dtoPage = patientPage.map(patient -> UserListViewDTO.builder()
                .id(patient.getId())
                .name(patient.getFirstName() + " " + patient.getLastName())
                .email(patient.getUser().getEmail())
                .contactNumber(patient.getContactNumber())
                .createdAt(patient.getUser().getCreatedAt())
                .build());

        return ResponseEntity.ok(dtoPage);
    }

    // --- NEW ENDPOINT: Get a paginated list of all doctors ---
    @GetMapping("/doctors")
    public ResponseEntity<Page<UserListViewDTO>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable paging = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Doctor> doctorPage = doctorRepository.findAll(paging);

        Page<UserListViewDTO> dtoPage = doctorPage.map(doctor -> UserListViewDTO.builder()
                .id(doctor.getId())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .email(doctor.getUser().getEmail())
                .contactNumber(doctor.getContactNumber())
                .createdAt(doctor.getUser().getCreatedAt())
                .build());

        return ResponseEntity.ok(dtoPage);
    }

    // --- NEW ENDPOINT: Get all reviews for admin oversight ---
    @GetMapping("/reviews")
    public ResponseEntity<List<AdminReviewViewDTO>> getAllReviews() {
        List<DoctorRating> allRatings = ratingRepository.findAllByOrderByCreatedAtDesc();

        // Map to the detailed Admin DTO
        List<AdminReviewViewDTO> dtoList = allRatings.stream()
                .map(rating -> AdminReviewViewDTO.builder()
                        .ratingId(rating.getId())
                        .rating(rating.getRating())
                        .review(rating.getReview())
                        .createdAt(rating.getCreatedAt())
                        .patientName(rating.getPatient().getFirstName() + " " + rating.getPatient().getLastName())
                        .patientEmail(rating.getPatient().getUser().getEmail())
                        .doctorName("Dr. " + rating.getDoctor().getFirstName() + " " + rating.getDoctor().getLastName())
                        .doctorSpecialization(rating.getDoctor().getSpecialization())
                        .build())
                .toList();

        return ResponseEntity.ok(dtoList);
    }
    
    // --- NEW ENDPOINT: Delete a review (for moderation) ---
    @DeleteMapping("/reviews/{ratingId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long ratingId) {
        if (!ratingRepository.existsById(ratingId)) {
            return ResponseEntity.notFound().build();
        }
        ratingRepository.deleteById(ratingId);
        return ResponseEntity.ok("Review has been deleted successfully.");
    }
}