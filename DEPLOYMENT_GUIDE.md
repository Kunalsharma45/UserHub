# 🚀 DEPLOYMENT GUIDE - User Management System

## 📋 **Complete Deployment Instructions for Production**

This guide will help you deploy both **frontend** and **backend** to the cloud.

---

## 🎯 **Deployment Options**

### **Recommended Stack:**
- **Frontend:** Vercel or Netlify (Free)
- **Backend:** Railway or Render (Free tier)
- **Database:** Railway MySQL or AWS RDS (Free tier)

---

## 📦 **PART 1: BACKEND DEPLOYMENT (Spring Boot)**

### **Option A: Deploy to Railway.app** ⭐ **RECOMMENDED**

#### **Step 1: Prepare Backend for Production**

**Update `application.properties`:**

```properties
# Database - Use Environment Variables
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update

# JWT
bezkoder.app.jwtSecret=${JWT_SECRET}
bezkoder.app.jwtExpirationMs=86400000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

#### **Step 2: Create Railway Account**

1. Visit: https://railway.app/
2. Sign up with GitHub
3. Verify your email

#### **Step 3: Deploy Backend to Railway**

**Method 1: GitHub (Recommended)**

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **On Railway:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Spring Boot

3. **Add MySQL Database:**
   - Click "+ New"
   - Select "Database"
   - Choose "MySQL"
   - Railway will create a database

4. **Set Environment Variables:**
   
   Click on your Spring Boot service → Variables → Add the following:

   ```
   DATABASE_URL=mysql://user:password@host:port/dbname
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=<from Railway MySQL>
   JWT_SECRET=YourSecretKeyHere123!@#
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=8080
   ```

   **Note:** Railway will provide `DATABASE_URL` automatically from the MySQL service.

5. **Deploy:**
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - Copy the public URL (e.g., `https://your-app.up.railway.app`)

#### **Step 4: Initialize Database**

**Run these SQL commands in Railway MySQL:**

1. Click on MySQL service
2. Go to "Data" tab
3. Run:

```sql
USE railway;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_MODERATOR');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

SELECT * FROM roles;
```

---

### **Option B: Deploy to Render.com**

#### **1. Create `render.yaml`:**

```yaml
services:
  - type: web
    name: user-management-api
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: userdb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
```

#### **2. Deploy:**
1. Push to GitHub
2. Visit https://render.com/
3. New → Web Service
4. Connect GitHub repo
5. Render auto-deploys

---

## 🎨 **PART 2: FRONTEND DEPLOYMENT (React)**

### **Option A: Deploy to Vercel** ⭐ **RECOMMENDED**

#### **Step 1: Prepare Frontend**

**Update `frontend/.env`:**

```env
VITE_API_BASE_URL=https://your-backend.up.railway.app/api
VITE_JWT_EXPIRATION=86400000
```

**Build the frontend:**

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized production files.

#### **Step 2: Deploy to Vercel**

**Option 1: Vercel CLI (Fast)**

```bash
npm install -g vercel
cd frontend
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `user-management`
- Directory? `./`
- Override build command? **N**
- Override output directory? **N**

**Option 2: Vercel Dashboard**

1. Visit https://vercel.com/
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.up.railway.app/api
   ```
7. Click "Deploy"

**Your frontend will be live at:** `https://user-management.vercel.app`

---

### **Option B: Deploy to Netlify**

#### **Build and Deploy:**

```bash
cd frontend
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or use **Netlify Dashboard:**
1. Drag & drop `dist` folder
2. Set environment variables
3. Deploy

---

## 🔐 **PART 3: SECURITY CHECKLIST**

### **Before Going Live:**

- [ ] Change JWT secret to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (Railway/Vercel provide this automatically)
- [ ] Update CORS in backend to allow only your frontend domain
- [ ] Use production database credentials
- [ ] Test all features on production
- [ ] Set up error monitoring (Sentry)

### **Update CORS in WebSecurityConfig.java:**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "https://your-frontend.vercel.app"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## 📊 **PART 4: POST-DEPLOYMENT**

### **1. Test Complete Flow**

Visit your deployed frontend:

- [ ] Register new user
- [ ] Login
- [ ] Access dashboard
- [ ] Test forgot password (OTP)
- [ ] Test admin features

### **2. Monitor Logs**

**Railway:**
- Click on service → Logs tab
- Monitor for errors

**Vercel:**
- Project → Logs
- Check for failed requests

### **3. Set Up Custom Domain (Optional)**

**Vercel:**
1. Settings → Domains
2. Add your domain
3. Update DNS records

**Railway:**
1. Service → Settings → Networking
2. Add custom domain

---

## 🆘 **TROUBLESHOOTING**

### **Backend Issues:**

**Error: Database connection failed**
- Check `DATABASE_URL` environment variable
- Verify database is running
- Check firewall rules

**Error: CORS blocked**
- Update allowed origins in CORS config
- Redeploy backend

### **Frontend Issues:**

**Error: API calls failing**
- Check `VITE_API_BASE_URL` is correct
- Verify backend is running
- Check browser console for exact error

**Error: Blank page**
- Check browser console
- Verify all environment variables are set
- Rebuild with `npm run build`

---

## 📝 **QUICK DEPLOYMENT CHECKLIST**

### **Backend (Railway)**
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Database initialized with roles
- [ ] Backend URL copied

### **Frontend (Vercel)**
- [ ] `.env` updated with backend URL
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Deployment tested

---

## 🎯 **ESTIMATED COSTS**

| Service | Free Tier | Paid (Optional) |
|---------|-----------|-----------------|
| Railway Backend | 500 hours/month | $5/month |
| Railway MySQL | 1GB storage | $5/month |
| Vercel Frontend | Unlimited | $20/month (Pro) |
| Total | **FREE** | $10-30/month |

---

## 📚 **USEFUL LINKS**

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Spring Boot Deployment: https://spring.io/guides/gs/spring-boot/
- Vite Production Build: https://vitejs.dev/guide/build.html

---

## 🎉 **SUCCESS METRICS**

After deployment, your app should:
- ✅ Load in < 2 seconds
- ✅ Handle 100+ concurrent users
- ✅ 99.9% uptime (with Railway/Vercel SLA)
- ✅ HTTPS enabled
- ✅ All features working

---

**Last Updated:** December 13, 2025
**Status:** Production-ready deployment guide
**Difficulty:** Intermediate
**Time Required:** 30-60 minutes
