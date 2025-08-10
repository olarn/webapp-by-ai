@echo off
REM Comprehensive UI Test Runner Script (Windows version)
REM This script handles the complete UI testing workflow:
REM 1. Stop frontend and backend servers
REM 2. Clean up test results
REM 3. Start servers
REM 4. Check servers are up & running
REM 5. Run UI tests

setlocal enabledelayedexpansion

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

echo 🚀 Starting comprehensive UI test workflow...
echo.

REM Step 1: Stop existing servers
echo 🔄 Step 1: Stopping existing servers...
echo 🔄 Stopping servers...

REM Kill processes on backend port (8000)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes on frontend port (5173)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo ✅ All servers stopped
echo.

REM Step 2: Clean up test results
echo 🔄 Step 2: Cleaning up test results...
echo 🔄 Cleaning up UI test results...

REM Remove test results directory
if exist "test-results" (
    echo   Removing test-results directory...
    rmdir /s /q "test-results"
    echo   ✅ test-results directory removed
)

REM Remove playwright report directory
if exist "playwright-report" (
    echo   Removing playwright-report directory...
    rmdir /s /q "playwright-report"
    echo   ✅ playwright-report directory removed
)

REM Remove any .last-run.json files that might be in root
if exist ".last-run.json" (
    echo   Removing .last-run.json file...
    del ".last-run.json"
    echo   ✅ .last-run.json file removed
)

REM Remove any test artifacts in ui-tests directory
if exist "ui-tests" (
    echo   Cleaning ui-tests directory...
    for /r "ui-tests" %%f in (*.log *.tmp *.cache) do (
        if exist "%%f" del "%%f"
    )
    echo   ✅ ui-tests directory cleaned
)

echo ✅ UI test cleanup completed!
echo.

REM Step 3: Start servers
echo 🔄 Step 3: Starting servers...
echo 🔄 Starting servers...

REM Start backend server
echo 🔄 Starting backend server...
cd backend
start /b npm run dev > ..\logs\backend.log 2>&1
cd ..

REM Start frontend server
echo 🔄 Starting frontend server...
cd frontend
start /b npm run dev > ..\logs\frontend.log 2>&1
cd ..

echo ✅ Servers started
echo.

REM Step 4: Check servers are up & running
echo 🔄 Step 4: Checking servers are up & running...

REM Wait for backend server
echo 🔄 Waiting for server at http://localhost:8000 to be ready...
set /a attempts=0
:wait_backend
set /a attempts+=1
if %attempts% gtr 30 (
    echo ❌ Backend server failed to start
    goto cleanup
)
timeout /t 2 /nobreak >nul
curl -s "http://localhost:8000" >nul 2>&1
if errorlevel 1 (
    echo -n .
    goto wait_backend
)
echo ✅ Server at http://localhost:8000 is ready!

REM Wait for frontend server
echo 🔄 Waiting for server at http://localhost:5173 to be ready...
set /a attempts=0
:wait_frontend
set /a attempts+=1
if %attempts% gtr 30 (
    echo ❌ Frontend server failed to start
    goto cleanup
)
timeout /t 2 /nobreak >nul
curl -s "http://localhost:5173" >nul 2>&1
if errorlevel 1 (
    echo -n .
    goto wait_frontend
)
echo ✅ Server at http://localhost:5173 is ready!

echo ✅ All servers are running and ready!
echo.

REM Step 5: Run UI tests
echo 🔄 Step 5: Running UI tests...
echo.

echo 🔄 Running UI tests...

npx playwright test
if errorlevel 1 (
    echo.
    echo ❌ UI tests failed!
    
    REM Still try to open report even if tests failed (for debugging)
    if exist "playwright-report\index.html" (
        echo 🔄 Opening test report in browser for debugging...
        start playwright-report\index.html
    )
    goto cleanup
)

echo.
echo 🎉 All steps completed successfully!
echo ✅ Test results are available in the test-results/ directory
echo ✅ Test report is available in the playwright-report/ directory

REM Open test report in browser
echo 🔄 Opening test report in browser...
start playwright-report\index.html
echo ✅ Test report opened in browser!

:cleanup
REM Cleanup
echo.
echo 🔄 Cleaning up servers...
echo 🔄 Stopping servers...

REM Kill processes on backend port (8000)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes on frontend port (5173)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo ✅ All servers stopped

echo.
echo ✅ Workflow completed!
pause
