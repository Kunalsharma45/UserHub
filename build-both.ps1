# Build Both JAR and WAR
# Creates both JAR and WAR versions of the application

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Building JAR & WAR Files" -ForegroundColor Cyan  
Write-Host "================================`n" -ForegroundColor Cyan

# Build JAR (default)
Write-Host "[1/2] Building JAR..." -ForegroundColor Yellow
mvn clean package -Dpackaging=jar -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ JAR build failed!`n" -ForegroundColor Red
    exit 1
}

# Rename JAR to save it
Copy-Item "target\spring-boot-security-jwt-0.0.1-SNAPSHOT.jar" "target\app.jar"
Write-Host "✓ JAR created`n" -ForegroundColor Green

# Build WAR (with profile)  
Write-Host "[2/2] Building WAR..." -ForegroundColor Yellow
mvn clean package -P war -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ WAR build failed!`n" -ForegroundColor Red
    exit 1
}

# Restore JAR
Copy-Item "target\app.jar" "target\spring-boot-security-jwt-0.0.1-SNAPSHOT.jar"
Remove-Item "target\app.jar"

Write-Host "✓ WAR created`n" -ForegroundColor Green

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ BUILD COMPLETE!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Files in target/:" -ForegroundColor White
Write-Host "  → spring-boot-security-jwt-0.0.1-SNAPSHOT.jar" -ForegroundColor Yellow
Write-Host "  → spring-boot-security-jwt-0.0.1-SNAPSHOT.war" -ForegroundColor Yellow

# Show sizes
$jar = Get-Item "target\spring-boot-security-jwt-0.0.1-SNAPSHOT.jar"
$war = Get-Item "target\spring-boot-security-jwt-0.0.1-SNAPSHOT.war"

Write-Host "`nSizes:" -ForegroundColor White
Write-Host "  JAR: $([math]::Round($jar.Length/1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "  WAR: $([math]::Round($war.Length/1MB, 2)) MB`n" -ForegroundColor Cyan

Write-Host "Both files ready for deployment! 🚀`n" -ForegroundColor Green
