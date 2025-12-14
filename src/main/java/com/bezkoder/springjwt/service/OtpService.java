package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Otp;
import com.bezkoder.springjwt.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    // Generate 6-digit OTP
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Save OTP for user
    @Transactional
    public Otp saveOTP(Long userId, String otpCode) {
        // Delete any existing OTP for this user
        otpRepository.deleteByUserId(userId);

        // Create and save new OTP
        Otp otp = new Otp(userId, otpCode);
        return otpRepository.save(otp);
    }

    // Validate OTP
    public boolean validateOTP(Long userId, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findByUserIdAndVerifiedFalse(userId);

        if (otpOptional.isEmpty()) {
            return false;
        }

        Otp otp = otpOptional.get();

        if (otp.isExpired()) {
            return false;
        }

        if (!otp.getOtpCode().equals(otpCode)) {
            return false;
        }

        // Mark as verified
        otp.setVerified(true);
        otpRepository.save(otp);

        return true;
    }

    // Find verified OTP
    public Optional<Otp> findVerifiedOtp(Long userId) {
        return otpRepository.findByUserId(userId);
    }

    // Delete OTP after use
    @Transactional
    public void deleteOTP(Long userId) {
        otpRepository.deleteByUserId(userId);
    }
}
