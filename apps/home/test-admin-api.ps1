# Admin API Test Script
# Run this after starting the dev server

# Change port to match your home app port (check terminal output)
$PORT = "3002"  # or "3000" if running home app directly

Write-Host "Testing Admin Registration API..." -ForegroundColor Cyan

$body = @{
    username = "testadmin"
    email = "testadmin@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:$PORT/api/admin/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Response: $errorBody" -ForegroundColor Yellow
    }
}
