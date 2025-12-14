package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByUserIdAndVerifiedFalse(Long userId);

    Optional<Otp> findByUserId(Long userId);

    @Transactional
    void deleteByUserId(Long userId);
}
