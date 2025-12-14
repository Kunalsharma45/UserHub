# 🚀 Quick Start Guide - User Management System

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- ✅ **Java 17** or higher
- ✅ **Maven** 3.6+ or use included wrapper
- ✅ **MySQL** 8.0+
- ✅ **Node.js** 18+ and **npm** 9+
- ✅ **Git** (for version control)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Database Setup (2 minutes)

```bash
# Start MySQL server (if not running)
# Windows: Start MySQL service from Services
# Or use XAMPP/WAMP

# Open MySQL command line or MySQL Workbench
mysql -u root -p

# Execute the following SQL commands:
```

```sql
-- Create database
CREATE DATABASE testdb_spring;

-- Use the database
USE testdb_spring;

-- Insert roles (CRITICAL - Required for signup)
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');

-- Verify roles are inserted
SELECT * FROM roles;
```

### Step 2: Configure Backend (1 minute)

Edit `src/main/resources/application.properties`:

```properties
# Update MySQL credentials if different
spring.datasource.url=jdbc:mysql://localhost:3306/testdb_spring?useSSL=false
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration (Change secret in production!)
bezkoder.app.jwtSecret= ======================BezKoder=Spring===========================
bezkoder.app.jwtExpirationMs=86400000
```

### Step 3: Start Backend (2 minutes)

```bash
# Navigate to backend directory
cd "d:/Devops project/spring-boot-spring-security-jwt-authentication-master/spring-boot-spring-security-jwt-authentication-master"

# Option 1: Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Option 2: Using Maven
mvn clean install
mvn spring-boot:run

# Wait for: "Started SpringBootSecurityJwtApplication"
# Backend running on: http://localhost:8080
```

### Step 4: Test Backend (Optional)

Open a new terminal or use Postman:

```bash
# Test public endpoint
curl http://localhost:8080/api/test/all

# Test signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"test123\"}"

# Test signin
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"test123\"}"
```

---

## 🎨 Frontend Setup (Optional - If Creating New React App)

### Option A: Quick Setup with Vite (Recommended)

```bash
# Navigate to project root
cd "d:/Devops project/spring-boot-spring-security-jwt-authentication-master/spring-boot-spring-security-jwt-authentication-master"

# Create React app
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install react-router-dom axios

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create .env file
echo VITE_API_BASE_URL=http://localhost:8080/api > .env

# Start development server
npm run dev

# Frontend running on: http://localhost:5173
```

### Option B: Using Create React App

```bash
# Create React app
npx create-react-app frontend

cd frontend

# Install dependencies
npm install react-router-dom axios

# Install Tailwind CSS
npm install -D tailwindcss
npx tailwindcss init

# Create .env file
echo REACT_APP_API_BASE_URL=http://localhost:8080/api > .env

# Start development server
npm start

# Frontend running on: http://localhost:3000
```

---

## 🧪 Testing the System

### 1. Test User Registration

**Via Postman/Insomnia:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": ["user"]
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully!"
}
```

### 2. Test User Login

**Request:**
```
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["ROLE_USER"]
}
```

### 3. Test Protected Endpoint

**Request:**
```
GET http://localhost:8080/api/test/user
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response:**
```
User Content.
```

### 4. Test Admin Endpoint (Should Fail for Regular User)

**Request:**
```
GET http://localhost:8080/api/test/admin
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (403 Forbidden):**
```json
{
  "path": "/api/test/admin",
  "error": "Forbidden",
  "message": "Forbidden",
  "status": 403
}
```

---

## 🔑 Creating Admin User

### Method 1: Via Database (Direct)

```sql
-- First, create admin user via signup endpoint, then update role:
UPDATE user_roles SET role_id = 3 WHERE user_id = 1;

-- Verify
SELECT u.username, r.name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
```

### Method 2: Via API (Signup with Admin Role)

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":[\"admin\"]}"
```

---

## 📊 Project Status Check

### Backend Health Check

```bash
# 1. Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# 2. Check if Spring Boot is running
curl http://localhost:8080/api/test/all

# 3. Check database tables
mysql -u root -p testdb_spring -e "SHOW TABLES"

# Expected tables:
# - users
# - roles
# - user_roles
```

### Database Verification

```sql
-- Check roles
SELECT * FROM roles;
-- Should show: ROLE_USER, ROLE_MODERATOR, ROLE_ADMIN

-- Check users
SELECT * FROM users;

-- Check user-role mappings
SELECT u.username, r.name as role 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN roles r ON ur.role_id = r.id;
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Error: Role is not found"

**Cause:** Roles not inserted into database  
**Solution:**
```sql
USE testdb_spring;
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');
```

### Issue 2: MySQL Connection Failed

**Cause:** Incorrect credentials or MySQL not running  
**Solution:**
1. Verify MySQL is running
2. Check username/password in `application.properties`
3. Ensure database `testdb_spring` exists

### Issue 3: Port 8080 Already in Use

**Solution:**
```properties
# In application.properties, add:
server.port=8081
```

### Issue 4: CORS Error from Frontend

**Cause:** Backend not allowing frontend origin  
**Solution:** Backend already has `@CrossOrigin(origins = "*")` - should work. If not:
```java
// In WebSecurityConfig.java, add:
http.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Arrays.asList("*"));
    return config;
}));
```

### Issue 5: JWT Token Expired

**Cause:** Token expiration (24 hours by default)  
**Solution:** Login again to get new token

---

## 📚 API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Login user | No |

### Protected Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/test/all` | Public content | None |
| GET | `/api/test/user` | User content | USER, MOD, ADMIN |
| GET | `/api/test/mod` | Moderator content | MODERATOR, ADMIN |
| GET | `/api/test/admin` | Admin content | ADMIN |

---

## 🚀 Next Steps

### For Backend Development:
1. ✅ Backend is running
2. 📝 Add more endpoints (profile, password reset, etc.)
3. 🔒 Enhance security (environment variables)
4. 📊 Add business logic specific to your use case

### For Frontend Development:
1. 📁 Follow `FRONTEND_IMPLEMENTATION_GUIDE.md`
2. 🎨 Copy provided React components
3. 🔌 Test integration with backend
4. 💅 Customize UI as needed

### For Full Integration:
1. 🌐 Create complete frontend (see guide)
2. 🧪 Test all user flows
3. 📦 Prepare for deployment
4. 🚀 Deploy to production

---

## 🔗 Important Files

- **Backend Config:** `src/main/resources/application.properties`
- **Security Config:** `src/main/java/com/bezkoder/springjwt/security/WebSecurityConfig.java`
- **Auth Controller:** `src/main/java/com/bezkoder/springjwt/controllers/AuthController.java`
- **JWT Utils:** `src/main/java/com/bezkoder/springjwt/security/jwt/JwtUtils.java`

---

## 📞 Getting Help

If you encounter issues:

1. **Check Logs:** Look at Spring Boot console output for errors
2. **Verify Database:** Ensure MySQL is running and roles are inserted
3. **Test Endpoints:** Use Postman to test each endpoint individually
4. **Review Documentation:** 
   - `PROJECT_ANALYSIS.md` - Detailed backend analysis
   - `FRONTEND_IMPLEMENTATION_GUIDE.md` - Frontend setup guide

---

## ✅ Success Checklist

- [ ] MySQL running and accessible
- [ ] Database `testdb_spring` created
- [ ] Roles inserted into `roles` table
- [ ] `application.properties` configured correctly
- [ ] Spring Boot application starts without errors
- [ ] Can access http://localhost:8080/api/test/all
- [ ] Can register new user via `/api/auth/signup`
- [ ] Can login via `/api/auth/signin`
- [ ] Receive JWT token after login
- [ ] Can access protected endpoints with token

---

**Congratulations! 🎉**  
Your backend is now fully functional. Proceed to frontend development using the implementation guide!

---

**Last Updated:** December 13, 2025  
**Status:** ✅ Quick Start Guide Complete
