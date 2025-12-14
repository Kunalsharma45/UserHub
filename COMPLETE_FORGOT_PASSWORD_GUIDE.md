# 🔐 COMPLETE FORGOT PASSWORD IMPLEMENTATION GUIDE

## ✅ ALL CODE READY TO COPY-PASTE!

---

## STEP 1: Update pom.xml

**Open:** `pom.xml`

**Find line 67** (after `</dependency>` of jjwt-jackson)

**Add this dependency:**

```xml

<!-- Email Support for OTP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Save and run:**
```bash
mvn clean install
```

---

## STEP 2: Update application.properties

**Open:** `src/main/resources/application.properties`

**Add at the END of the file:**

```properties

# Email Configuration for OTP (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD_HERE
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
```

**⚠️ REPLACE:**
- `YOUR_EMAIL@gmail.com` with your Gmail
- `YOUR_APP_PASSWORD_HERE` with your Gmail App Password

**How to get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other"
5. Type "User Management System"
6. Click "Generate"
7. Copy the 16-character password (no spaces)
8. Paste in application.properties

---

## STEP 3: Update AuthController.java

**Open:** `src/main/java/com/bezkoder/springjwt/controllers/AuthController.java`

### 3A. Add Imports (after line 33)

**Add these imports at the top after existing imports:**

```java
import com.bezkoder.springjwt.payload.request.ForgotPasswordRequest;
import com.bezkoder.springjwt.payload.request.VerifyOtpRequest;
import com.bezkoder.springjwt.payload.request.ResetPasswordRequest;
import com.bezkoder.springjwt.service.EmailService;
import com.bezkoder.springjwt.service.OtpService;
import java.util.Optional;
```

### 3B. Add Services (after line 51 - after `JwtUtils jwtUtils;`)

**Add these @Autowired fields:**

```java

@Autowired
EmailService emailService;

@Autowired
OtpService otpService;
```

### 3C. Add 3 Endpoints (before the final closing brace `}`)

**Add these 3 methods at the END of the AuthController class:**

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
        
        // Generate 6-digit OTP
        String otpCode = otpService.generateOTP();
        
        // Save OTP to database
        otpService.saveOTP(user.getId(), otpCode);
        
        // Send email with OTP
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
        
        // Check if OTP is expired
        if (otpOptional.get().isExpired()) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: OTP has expired!"));
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

**Save the file.**

---

## STEP 4: Restart Backend

```bash
# Stop current backend (Ctrl+C in terminal)
mvn clean install
mvn spring-boot:run
```

---

## ✅ TESTING FORGOT PASSWORD

### Test 1: Send OTP

**PowerShell:**
```powershell
curl -X POST http://localhost:8080/api/auth/forgot-password -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\"}"
```

**Expected Response:**
```json
{"message": "OTP sent to your email successfully!"}
```

**Check your email for the 6-digit OTP!**

---

### Test 2: Verify OTP

**Replace 123456 with the actual OTP from your email:**

```powershell
curl -X POST http://localhost:8080/api/auth/verify-otp -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"otpCode\":\"123456\"}"
```

**Expected Response:**
```json
{"message": "OTP verified successfully! You can now reset your password."}
```

---

### Test 3: Reset Password

```powershell
curl -X POST http://localhost:8080/api/auth/reset-password -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"otpCode\":\"123456\",\"newPassword\":\"newpassword123\"}"
```

**Expected Response:**
```json
{"message": "Password reset successfully! You can now login with your new password."}
```

---

### Test 4: Login with New Password

```powershell
curl -X POST http://localhost:8080/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"newpassword123\"}"
```

**Should return JWT token!**

---

## 🎨 TESTING FROM FRONTEND

### 1. Go to Forgot Password Page
```
http://localhost:5174/forgot-password
```

### 2. Enter your email
- The email you registered with

### 3. Check email for OTP
- You should receive a 6-digit code

### 4. Enter OTP
- Auto-redirected to verify OTP page
- Enter the 6 digits

### 5. Reset Password
- Auto-redirected to reset password page
- Enter new password
- Confirm password

### 6. Login
- Redirected to login
- Use new password!

---

## ✅ COMPLETION CHECKLIST

- [ ] pom.xml updated (email dependency)
- [ ] mvn clean install run
- [ ] application.properties updated (Gmail config)
- [ ] Gmail App Password obtained
- [ ] AuthController.java updated (imports)
- [ ] AuthController.java updated (services)
- [ ] AuthController.java updated (3 endpoints)
- [ ] Backend restarted
- [ ] Tested with curl/PowerShell
- [ ] Received OTP email
- [ ] Verified OTP works
- [ ] Password reset works
- [ ] Login with new password works
- [ ] Tested from frontend UI

---

## 🎉 CONGRATULATIONS!

**Your forgot password feature is now 100% complete!**

**Users can now:**
✅ Request password reset via email
✅ Receive 6-digit OTP
✅ Verify OTP (10-minute expiration)
✅ Set new password
✅ Login with new credentials

---

**Last Updated:** December 13, 2025, 8:42 PM IST
**Status:** Complete implementation guide with all code!
