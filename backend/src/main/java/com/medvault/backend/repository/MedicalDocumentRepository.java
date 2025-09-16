// src/main/java/com/medvault/backend/repository/MedicalDocumentRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {
}