# 🚀 COMPLETE OTP IMPLEMENTATION GUIDE

## ✅ **PHASE 2: FORGOT PASSWORD WITH OTP - All Code Ready!**

Follow these steps exactly to implement the complete OTP feature.

---

## 📝 **STEP 1: Update pom.xml**

**Open:** `pom.xml`

**Find line 67** (after `</dependency>` of jjwt-jackson)

**Add this NEW dependency:**

```xml
<!-- Email Support for OTP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Then run in terminal:**
```bash
mvn clean install
```

---

## 📝 **STEP 2: Configure Email in application.properties**

**Open:** `src/main/resources/application.properties`

**Add at the END of the file:**

```properties
# Email Configuration for OTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**⚠️ IMPORTANT:** Replace with your actual Gmail and App Password!

**How to get App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-character password

---

## 📝 **STEP 3: Create OTP Entity**

**Create file:** `src/main/java/com/bezkoder/springjwt/models/Otp.java`

```java
package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity  
@Table(name = "otp")
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 6)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean verified = false;

    // Constructors
    public Otp() {}

    public Otp(Long userId, String otpCode) {
        this.userId = userId;
        this.otpCode = otpCode;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(10);
        this.verified = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}
```

---

## 📝 **STEP 4: Create OTP Repository**

**Create file:** `src/main/java/com/bezkoder/springjwt/repository/OtpRepository.java`

```java
package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByUserIdAndVerifiedFalse(Long userId);
    
    @Transactional
    void deleteByUserId(Long userId);
}
```

---

## 📝 **STEP 5: Create Email Service**

**Create file:** `src/main/java/com/bezkoder/springjwt/service/EmailService.java`

```java
package com.bezkoder.springjwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP - User Management System");
            message.setText("Your OTP for password reset is: " + otpCode + "\n\n" +
                           "This OTP will expire in 10 minutes.\n\n" +
                           "If you didn't request this, please ignore this email.\n\n" +
                           "Best regards,\nUser Management System");
            
            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
```

---

## 📝 **STEP 6: Create OTP Service**

**Create file:** `src/main/java/com/bezkoder/springjwt/service/OtpService.java`

```java
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

    // Delete OTP after use
    @Transactional
    public void deleteOTP(Long userId) {
        otpRepository.deleteByUserId(userId);
    }
}
```

---

## 📝 **STEP 7: Create Password Reset Request DTOs**

**Create file:** `src/main/java/com/bezkoder/springjwt/payload/request/ForgotPasswordRequest.java`

```java
package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    
    @NotBlank
    @Email
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

**Create file:** `src/main/java/com/bezkoder/springjwt/payload/request/VerifyOtpRequest.java`

```java
package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String otpCode;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }
}
```

**Create file:** `src/main/java/com/bezkoder/springjwt/payload/request/ResetPasswordRequest.java`

```java
package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String otpCode;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
```

---

## 📝 **STEP 8: Update AuthController with Password Reset Endpoints**

**Open:** `src/main/java/com/bezkoder/springjwt/controllers/AuthController.java`

**Add these imports at the top:**

```java
import com.bezkoder.springjwt.payload.request.ForgotPasswordRequest;
import com.bezkoder.springjwt.payload.request.VerifyOtpRequest;
import com.bezkoder.springjwt.payload.request.ResetPasswordRequest;
import com.bezkoder.springjwt.service.EmailService;
import com.bezkoder.springjwt.service.OtpService;
import com.bezkoder.springjwt.models.User;
import java.util.Optional;
```

**Add these @Autowired fields after existing ones:**

```java
@Autowired
EmailService emailService;

@Autowired
OtpService otpService;
```

**Add these 3 new endpoints at the END of the AuthController class (before closing }):**

```java
@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    try {
        // Check if email exists
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email not found!"));
        }
        
        User user = userOptional.get();
        
        // Generate OTP
        String otpCode = otpService.generateOTP();
        
        // Save OTP
        otpService.saveOTP(user.getId(), otpCode);
        
        // Send email
        emailService.sendOtpEmail(user.getEmail(), otpCode);
        
        return ResponseEntity.ok(new MessageResponse("OTP sent to your email successfully!"));
        
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body(new MessageResponse("Error: Failed to send OTP. " + e.getMessage()));
    }
}

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
    try {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email not found!"));
        }
        
        User user = userOptional.get();
        
        // Validate OTP
        boolean isValid = otpService.validateOTP(user.getId(), request.getOtpCode());
        
        if (!isValid) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid or expired OTP!"));
        }
        
        return ResponseEntity.ok(new MessageResponse("OTP verified successfully! You can now reset your password."));
        
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body(new MessageResponse("Error: " + e.getMessage()));
    }
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    try {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email not found!"));
        }
        
        User user = userOptional.get();
        
        // Validate OTP one more time
        Optional<com.bezkoder.springjwt.models.Otp> otpOptional = 
            otpService.findVerifiedOtp(user.getId());
        
        if (otpOptional.isEmpty() || !otpOptional.get().getOtpCode().equals(request.getOtpCode())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid OTP!"));
        }
        
        // Update password
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Delete OTP after successful password reset
        otpService.deleteOTP(user.getId());
        
        return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now login with your new password."));
        
    } catch (Exception e) {
        return ResponseEntity.status(500)
            .body(new MessageResponse("Error: " + e.getMessage()));
    }
}
```

---

## 📝 **STEP 9: Update OtpService with findVerifiedOtp Method**

**Add this method to** `OtpService.java`:

```java
public Optional<Otp> findVerifiedOtp(Long userId) {
    return otpRepository.findByUserIdAndVerifiedFalse(userId);
}
```

---

## 📝 **STEP 10: Add findByEmail Method to UserRepository**

**Open:** `src/main/java/com/bezkoder/springjwt/repository/UserRepository.java`

**Add this method:**

```java
Optional<User> findByEmail(String email);
```

---

## 🎯 **TESTING THE BACKEND**

**Restart your backend:**
1. Stop current backend (Ctrl+C)
2. Run: `mvn spring-boot:run`

**Test with PowerShell/cURL:**

```powershell
# 1. Forgot Password
curl -X POST http://localhost:8080/api/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"test@test.com"}'

# 2. Check your email for OTP, then verify
curl -X POST http://localhost:8080/api/auth/verify-otp -H "Content-Type: application/json" -d '{"email":"test@test.com","otpCode":"123456"}'

# 3. Reset password
curl -X POST http://localhost:8080/api/auth/reset-password -H "Content-Type: application/json" -d '{"email":"test@test.com","otpCode":"123456","newPassword":"newpass123"}'
```

---

## ✅ **CHECKLIST**

- [ ] Updated pom.xml with email dependency
- [ ] Configured email in application.properties  
- [ ] Created Otp entity
- [ ] Created OtpRepository
- [ ] Created EmailService
- [ ] Created OtpService
- [ ] Created 3 request DTOs
- [ ] Updated AuthController with 3 endpoints
- [ ] Added findByEmail to UserRepository
- [ ] Tested backend endpoints
- [ ] Ready for frontend!

---

**Next:** Frontend components (Forgot Password page, Verify OTP page, Reset Password page)

**Last Updated:** December 13, 2025, 8:09 PM IST
