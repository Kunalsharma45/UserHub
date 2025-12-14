# Spring Boot JWT Authentication & User Management System with Personal Storage

A complete Spring Boot application with JWT authentication, role-based access control, user management, OTP-based password recovery, and personal storage features.

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Java 17+
- MySQL 8.0+
- Node.js 18+
- Maven 3.6+

### **1. Database Setup:**
```bash
mysql -u root -p < setup-database.sql
```

### **2. Configure Database:**
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### **3. Start Backend:**
```bash
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### **4. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📚 **Complete Documentation**

### **Essential Guides:**
1. **[QUICK_START.md](QUICK_START.md)** - Detailed startup instructions
2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment  
3. **[BUILD_JAR_WAR_GUIDE.md](BUILD_JAR_WAR_GUIDE.md)** - Building JAR & WAR files
4. **[MAVEN_COMPLETE_GUIDE.md](MAVEN_COMPLETE_GUIDE.md)** - Maven deep dive

### **Feature Guides:**
- **[COMPLETE_FORGOT_PASSWORD_GUIDE.md](COMPLETE_FORGOT_PASSWORD_GUIDE.md)** - OTP & password reset
- **[OTP_IMPLEMENTATION_GUIDE.md](OTP_IMPLEMENTATION_GUIDE.md)** - Email OTP system
- **[USER_APPROVAL_IMPLEMENTATION.md](USER_APPROVAL_IMPLEMENTATION.md)** - Admin approval system
- **[FRONTEND_IMPLEMENTATION_GUIDE.md](FRONTEND_IMPLEMENTATION_GUIDE.md)** - React frontend guide
- **[ADMIN_ACCESS_GUIDE.md](ADMIN_ACCESS_GUIDE.md)** - Admin dashboard usage

### **Testing & Verification:**
- **[COMPLETE_TESTING_GUIDE.md](COMPLETE_TESTING_GUIDE.md)** - Full testing procedures
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Feature checklist

### **Reference:**
- **[DOCUMENTATION_SUMMARY.md](DOCUMENTATION_SUMMARY.md)** - Complete project overview
- **[INDEX.md](INDEX.md)** - Documentation index

---

## ✨ **Features**

### **Authentication & Security:**
- ✅ JWT-based authentication
- ✅ Role-based access control (User, Admin)
- ✅ Secure password hashing (BCrypt)
- ✅ Email OTP verification for password reset
- ✅ Admin approval system for new users

### **User Management:**
- ✅ User registration & login
- ✅ Profile management (update info, change password)
- ✅ Forgot password with email OTP
- ✅ Admin dashboard for user management
- ✅ User approval/rejection workflow

### **Personal Storage:**
- ✅ Create & manage personal notes
- ✅ Upload & store files (images, PDFs, documents)
- ✅ Preview documents (images, files, notes)
- ✅ Edit & delete documents
- ✅ File type filtering

### **UI/UX:**
- ✅ Modern dark theme with glassmorphism
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations & transitions
- ✅ Clean, professional interface

---

## 🏗️ **Technology Stack**

### **Backend:**
- Spring Boot 3.1.0
- Spring Security 6
- JWT (JSON Web Tokens)
- MySQL 8.0
- JavaMail API
- JPA/Hibernate

### **Frontend:**
- React 18
- React Router v6
- Axios
- Modern CSS (Dark theme, Glassmorphism)

---

## 📦 **Build & Deploy**

### **Build JAR:**
```bash
mvn clean package -DskipTests
```
Output: `target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar` (50 MB)

### **Build WAR:**
```bash
mvn clean package -P war -DskipTests
```
Output: `target/spring-boot-security-jwt-0.0.1-SNAPSHOT.war` (50 MB)

### **Build Both:**
```powershell
.\build-both.ps1
```

### **Run JAR:**
```bash
java -jar target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar
```

### **Deploy WAR:**
Copy to Tomcat `webapps/` folder

See **[BUILD_JAR_WAR_GUIDE.md](BUILD_JAR_WAR_GUIDE.md)** for details.

---

## 🔑 **Default Credentials**

### **Admin Account:**
```
Username: admin
Password: admin123
Email: admin@example.com
```

### **Test User:**
```
Username: testuser
Password: password123
Email: user@example.com
```

---

## 📊 **API Endpoints**

### **Authentication:**
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register  
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### **User Management:**
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

### **Admin:**
- `GET /api/admin/users` - List all users
- `GET /api/admin/pending` - Pending approvals
- `POST /api/admin/approve/{id}` - Approve user
- `DELETE /api/admin/reject/{id}` - Reject user
- `PUT /api/admin/users/{id}/roles` - Update roles

### **Personal Storage:**
- `GET /api/user/documents` - List documents
- `POST /api/user/documents/note` - Create note
- `POST /api/user/documents/upload` - Upload file
- `GET /api/user/documents/files/{filename}` - Download file
- `PUT /api/user/documents/{id}` - Update document
- `DELETE /api/user/documents/{id}` - Delete document

---

## 🗂️ **Project Structure**

```
spring-boot-security-jwt/
├── src/main/java/com/bezkoder/springjwt/
│   ├── controllers/        # REST endpoints
│   ├── models/            # JPA entities
│   ├── repository/        # Data access
│   ├── security/          # JWT & security config
│   ├── payload/           # Request/Response DTOs
│   └── services/          # Business logic
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── api/           # API services
│   │   └── App.jsx        # Main app
│   └── public/           # Static assets
├── pom.xml               # Maven configuration
├── setup-database.sql    # Database schema
└── Documentation files   # Guides & references
```

---

## 🛠️ **Development**

### **Run in Development:**
```bash
# Backend (with hot reload)
mvn spring-boot:run

# Frontend (with hot reload)
cd frontend && npm run dev
```

### **Build for Production:**
```bash
# Backend
mvn clean package -DskipTests

# Frontend
cd frontend && npm run build
```

---

## 📧 **Email Configuration**

Configure in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

For Gmail, use **App Password** (not regular password).

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Database Connection Failed:**
   - Check MySQL is running
   - Verify credentials in `application.properties`

2. **Frontend Can't Connect:**
   - Ensure backend is running on `http://localhost:8080`
   - Check CORS configuration

3. **Email Not Sending:**
   - Verify email credentials
   - Allow less secure apps (Gmail)
   - Use app password for Gmail

4. **Build Fails:**
   - Run `mvn clean install`
   - Check Java version: `java -version` (should be 17+)

See **[COMPLETE_TESTING_GUIDE.md](COMPLETE_TESTING_GUIDE.md)** for detailed troubleshooting.

---

## 🎯 **Key Features Implemented**

### ✅ **Phase 1: Core Authentication**
- JWT authentication system
- User registration & login
- Role-based access control

### ✅ **Phase 2: Password Recovery**
- Email-based OTP system
- Forgot password flow
- Password reset functionality

### ✅ **Phase 3: User Management**
- Admin approval system
- User dashboard
- Admin dashboard
- Profile management

### ✅ **Phase 4: Personal Storage**
- Note creation & management
- File upload & storage
- Document preview
- File download

### ✅ **Phase 5: UI/UX Enhancement**
- Modern dark theme
- Responsive design
- Smooth animations
- Professional interface

---

## 📄 **License**

This project is open-source and available under the MIT License.

---

## 👥 **Support**

For issues, questions, or contributions:
- Check the documentation guides
- Review the testing guide
- Refer to implementation checklists

---

## 🎉 **Project Status: Complete & Production Ready!**

All features are implemented, tested, and ready for deployment. The application includes:
- ✅ Complete authentication system
- ✅ User management with admin approval
- ✅ Personal storage with file uploads
- ✅ Email OTP verification
- ✅ Modern, responsive UI
- ✅ Comprehensive documentation
- ✅ Production-ready builds (JAR & WAR)

**Ready to deploy anywhere!** 🚀
