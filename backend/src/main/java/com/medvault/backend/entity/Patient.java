// src/main/java/com/medvault/backend/entity/Patient.java
package com.medvault.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import com.medvault.backend.entity.VerificationStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This is the link to the users table.
    // One Patient profile is linked to one User login.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "contact_number")
    private String contactNumber;

    private String address;

    @Column(name = "emergency_contact")
    private String emergencyContact;


    @Builder.Default
    @Column(name = "is_profile_complete", nullable = false)
    private boolean isProfileComplete = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.NOT_UPLOADED;

    @Column(name = "government_id_path")
    private String governmentIdPath;
}

