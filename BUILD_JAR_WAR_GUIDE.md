# Build JAR and WAR Files - Guide

## 📦 **Both JAR and WAR Files Available!**

Your project can now be built as **both JAR and WAR** files.

---

## 🚀 **Quick Build - Both Files**

### **Option 1: Run PowerShell Script** (Easiest)
```powershell
.\build-both.ps1
```
This will create **both** JAR and WAR files automatically!

---

### **Option 2: Manual Build**

#### **Build JAR Only:**
```bash
mvn clean package -DskipTests
```
Creates: `target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar`

#### **Build WAR Only:**
```bash
mvn clean package -P war -DskipTests
```
Creates: `target/spring-boot-security-jwt.war`

---

## 📍 **File Locations**

After building, find your files in:
```
target/
├── spring-boot-security-jwt-0.0.1-SNAPSHOT.jar  (JAR file ~50 MB)
└── spring-boot-security-jwt.war                  (WAR file ~50 MB)
```

---

## 🎯 **When to Use Each?**

### **JAR File**
- ✅ **Standalone application**
- ✅ **Docker containers**
- ✅ **Cloud deployment** (AWS, Azure, GCP)
- ✅ **Microservices**
- ✅ **Simple deployment**

**Run JAR:**
```bash
java -jar target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar
```

### **WAR File**
- ✅ **External Tomcat server**
- ✅ **JBoss/WildFly**
- ✅ **Traditional app servers**
- ✅ **Enterprise environments**

**Deploy WAR:**
1. Copy to Tomcat webapps folder
2. Start Tomcat
3. Access at `http://localhost:8080/spring-boot-security-jwt/`

Or rename to `ROOT.war` for root context:
```bash
cp target/spring-boot-security-jwt.war /path/to/tomcat/webapps/ROOT.war
```

---

## 🔧 **Maven Profiles Explained**

The project now has **2 Maven profiles**:

### **1. JAR Profile** (Default)
- Active by default
- Standard Spring Boot JAR packaging
- Includes embedded Tomcat

### **2. WAR Profile**
- Activate with `-P war`
- Marks Tomcat as `provided`
- Suitable for external servlet containers

---

## 📝 **What Changed?**

### **1. Application Class**
```java
public class SpringBootSecurityJwtApplication extends SpringBootServletInitializer {
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SpringBootSecurityJwtApplication.class);
    }
    
    public static void main(String[] args) {
        SpringApplication.run(SpringBootSecurityJwtApplication.class, args);
    }
}
```
- Now extends `SpringBootServletInitializer`
- Works for **both** JAR and WAR deployment

### **2. POM.xml**
- Added WAR Maven profile
- Conditionally marks Tomcat as `provided` for WAR
- Both builds work from same config

---

## 🎨 **Deployment Examples**

### **Docker (JAR)**
```dockerfile
FROM openjdk:17-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### **Tomcat (WAR)**
```bash
# Copy WAR to Tomcat
cp target/spring-boot-security-jwt.war /opt/tomcat/webapps/

# Start Tomcat
/opt/tomcat/bin/startup.sh

# Access application
http://localhost:8080/spring-boot-security-jwt/
```

### **Standalone (JAR)**
```bash
# Run directly
java -jar target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar

# Access application
http://localhost:8080/
```

---

## ✅ **Verification**

After building, verify the files:

```bash
# Check if files exist
ls -lh target/*.jar
ls -lh target/*.war

# Check file sizes (should be ~50 MB each)
```

Expected output:
```
spring-boot-security-jwt-0.0.1-SNAPSHOT.jar  → 50.1 MB
spring-boot-security-jwt.war                  → 50.1 MB
```

---

## 🆘 **Troubleshooting**

### **Issue: WAR build fails**
**Solution:** Ensure SpringBootServletInitializer is extended
```bash
# Check the Application class
cat src/main/java/com/bezkoder/springjwt/SpringBootSecurityJwtApplication.java
```

### **Issue: JAR doesn't run**
**Solution:** Check Java version
```bash
java -version  # Should be Java 17+
```

### **Issue: WAR not deploying to Tomcat**
**Solution:** Check Tomcat version (should be 10+)
```bash
/path/to/tomcat/bin/version.sh
```

---

## 📊 **Comparison**

| Feature | JAR | WAR |
|---------|-----|-----|
| **Embedded Server** | ✅ Yes (Tomcat) | ❌ No (uses external) |
| **Standalone** | ✅ Yes | ⚠️ Needs app server |
| **File Size** | ~50 MB | ~50 MB |
| **Deployment** | Single command | Copy to webapps |
| **Best For** | Cloud, Docker | Enterprise servers |
| **Configuration** | Simple | May need server config |

---

## 🎉 **Summary**

- **JAR** = Default build, works everywhere with Java 17+
- **WAR** = For traditional app servers like Tomcat
- **Both** work from the same codebase!
- **One command** to build both (use `build-both.ps1`)

**Your application is now ready for any deployment scenario!** 🚀
