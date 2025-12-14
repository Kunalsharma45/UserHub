# 🔐 Admin Access Guide

## Quick Start: Access Admin Dashboard

### Method 1: Register New Admin User (Recommended)

1. **Navigate to Registration:**
   ```
   http://localhost:5173/register
   ```

2. **Fill Registration Form:**
   - **Username:** `admin` (or your choice)
   - **Email:** `admin@test.com`
   - **Password:** `admin123` (or your choice, min 6 chars)
   - **Confirm Password:** (same as password)
   - **Select Role:** ✅ Check **"Admin"** checkbox

3. **Submit Registration:**
   - Click "Create Account"
   - Wait for success message
   - Click "Sign in here" or navigate to login

4. **Login:**
   ```
   http://localhost:5173/login
   ```
   - Username: `admin`
   - Password: `admin123`
   - Click "Sign In"

5. **Automatic Redirect:**
   - Upon successful login, you'll be automatically redirected to:
   ```
   http://localhost:5173/admin
   ```

---

### Method 2: Use Existing Admin User

If you already created an admin user earlier, simply:

1. Go to: http://localhost:5173/login
2. Enter your admin credentials
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

---

### Method 3: Manually Navigate (If Already Logged In)

If you're already logged in with an admin account:
- Navigate directly to: http://localhost:5173/admin

---

## 🎯 Role-Based Redirect Logic

When you login, the application automatically redirects based on your role:

| Role | Redirect URL |
|------|--------------|
| **Admin** | `/admin` → Admin Dashboard |
| **Moderator** | `/moderator` → Moderator Dashboard |
| **User** | `/dashboard` → User Dashboard |

---

## 📝 Available Roles

You can select one or more roles during registration:

1. **User** 🟢
   - Standard user access
   - Access to: User Dashboard, Profile

2. **Moderator** 🔵
   - Moderate content and users
   - Access to: Moderator Dashboard, User Management (limited)

3. **Admin** 🔴
   - Full system access
   - Access to: Admin Dashboard, All User Management, Statistics

---

## 🧪 Test Credentials (For Testing)

You can create these test accounts:

### Admin Account
```
Username: admin
Email: admin@test.com
Password: admin123
Role: ✅ Admin
```

### Moderator Account
```
Username: moderator
Email: mod@test.com
Password: mod123
Role: ✅ Moderator
```

### Regular User Account
```
Username: user
Email: user@test.com
Password: user123
Role: ✅ User
```

---

## ⚠️ Troubleshooting

### "Access Denied" or Blank Page?
- Make sure you selected the **Admin** role during registration
- Try logging out and logging back in
- Check browser console (F12) for errors

### Can't Register?
- Make sure backend is running on port 8080
- Check if username/email already exists
- Use a different username/email

### Already Registered but Forgot Role?
You'll need to:
1. Login with the account
2. Check which dashboard you're redirected to
3. If it's not `/admin`, that account doesn't have admin role
4. Create a new account with admin role

---

## 🗄️ Database Check (Advanced)

If you want to verify users in the database directly:

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Use the database:
   ```sql
   USE testdb_spring;
   ```

3. Check users and their roles:
   ```sql
   SELECT 
       u.id,
       u.username,
       u.email,
       GROUP_CONCAT(r.name) as roles
   FROM users u
   LEFT JOIN user_roles ur ON u.id = ur.user_id
   LEFT JOIN roles r ON ur.role_id = r.id
   GROUP BY u.id, u.username, u.email;
   ```

4. To manually add admin role to existing user:
   ```sql
   -- First, find the user ID
   SELECT id FROM users WHERE username = 'your_username';
   
   -- Then add admin role (role_id 3 is usually ADMIN)
   INSERT INTO user_roles (user_id, role_id) VALUES (YOUR_USER_ID, 3);
   ```

---

## 🚀 Quick Commands

### Start Both Servers (if not running):

**Backend:**
```bash
cd "d:\Devops project\spring-boot-spring-security-jwt-authentication-master\spring-boot-spring-security-jwt-authentication-master"
mvn spring-boot:run
```

**Frontend:**
```bash
cd "d:\Devops project\spring-boot-spring-security-jwt-authentication-master\spring-boot-spring-security-jwt-authentication-master\frontend"
npm run dev
```

### Access Points:
- **Frontend:** http://localhost:5173/
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **Admin Dashboard:** http://localhost:5173/admin
- **Backend API:** http://localhost:8080/api

---

**💡 Tip:** The easiest way is to simply register a new account with the admin role checked! The whole process takes less than 1 minute.
