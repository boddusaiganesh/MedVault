// src/main/java/com/medvault/backend/controller/DocumentController.java
package com.medvault.backend.controller;

import com.medvault.backend.entity.*;
import com.medvault.backend.repository.*;
import com.medvault.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final FileStorageService fileStorageService;
    private final MedicalDocumentRepository medicalDocumentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @PostMapping("/upload/record/{recordId}")
    public ResponseEntity<?> uploadDocumentToRecord(
            @PathVariable Long recordId,
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Patient patient = patientRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Patient profile not found"));
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        // Security check: ensure the record belongs to the logged-in patient
        if (!record.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to upload to this record.");
        }

        String fileName = fileStorageService.storeFile(file, user.getEmail());

        MedicalDocument medicalDocument = MedicalDocument.builder()
                .record(record)
                .documentName(file.getOriginalFilename())
                .filePath(fileName)
                .fileType(file.getContentType())
                .build();

        medicalDocumentRepository.save(medicalDocument);
        return ResponseEntity.ok("File uploaded successfully. Awaiting doctor review.");
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long documentId, Principal principal, HttpServletRequest request) throws IOException {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        MedicalDocument doc = medicalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // --- CRITICAL SECURITY CHECK ---
        boolean isAuthorized = false;
        if (user.getRole() == Role.ROLE_USER) {
            Patient patient = patientRepository.findByUser(user).orElseThrow();
            // Is this the patient who owns the record?
            if (doc.getRecord().getPatient().getId().equals(patient.getId())) {
                isAuthorized = true;
            }
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            // In a real system, you'd check if this doctor is assigned to this patient.
            // For now, we'll allow any doctor to see any patient document for simplicity.
            isAuthorized = true; 
        }

        if (!isAuthorized) {
            return ResponseEntity.status(403).build();
        }

        Resource resource = fileStorageService.loadFileAsResource(doc.getFilePath());
        String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getDocumentName() + "\"")
                .body(resource);
    }
}