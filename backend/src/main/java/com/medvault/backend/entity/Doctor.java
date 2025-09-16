// src/main/java/com/medvault/backend/entity/Doctor.java
package com.medvault.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String specialization;

    @Column(name = "contact_number")
    private String contactNumber;

    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Builder.Default
    @Column(name = "is_profile_complete", nullable = false)
    private boolean isProfileComplete = false;

     // --- NEW FIELDS ---
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.NOT_UPLOADED;

    @Column(name = "medical_degree_path")
    private String medicalDegreePath;

    @Column(name = "medical_license_path")
    private String medicalLicensePath;

        // --- NEW TRANSIENT FIELDS ---
    // These are not stored in the DB, but calculated by a query
    @Transient
    private Double averageRating;

    @Transient
    private Long reviewCount;
}