// src/main/java/com/medvault/backend/entity/VerificationStatus.java
package com.medvault.backend.entity;

public enum VerificationStatus {
    NOT_UPLOADED,       // Initial state
    PENDING_VERIFICATION, // Documents uploaded, waiting for admin
    VERIFIED,           // Admin approved
    REJECTED ,           // Admin rejected
    
    PENDING_DOCTOR_REVIEW,
    NEEDS_CORRECTION
}