package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<UserDocument> findByUserIdAndDocumentTypeOrderByCreatedAtDesc(Long userId, String documentType);

    Long countByUserId(Long userId);
}
