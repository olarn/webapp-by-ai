#!/bin/bash

# Comprehensive UI Test Runner Script (Playwright UI Mode)
# This script handles the complete UI testing workflow with Playwright UI:
# 1. Stop frontend and backend servers
# 2. Clean up test results
# 3. Start servers
# 4. Check servers are up & running
# 5. Run UI tests with Playwright UI mode

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    if is_port_in_use $port; then
        print_status "Killing processes on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
        print_success "Processes on port $port killed"
    fi
}

# Function to wait for server to be ready
wait_for_server() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for server at $url to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "Server at $url is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Server at $url failed to start within $((max_attempts * 2)) seconds"
    return 1
}

# Function to clean up test results
cleanup_test_results() {
    print_status "Cleaning up UI test results..."
    
    # Remove test results directory
    if [ -d "test-results" ]; then
        print_status "  Removing test-results directory..."
        rm -rf test-results
        print_success "  test-results directory removed"
    fi
    
    # Remove playwright report directory
    if [ -d "playwright-report" ]; then
        print_status "  Removing playwright-report directory..."
        rm -rf playwright-report
        print_success "  playwright-report directory removed"
    fi
    
    # Remove any .last-run.json files that might be in root
    if [ -f ".last-run.json" ]; then
        print_status "  Removing .last-run.json file..."
        rm -f .last-run.json
        print_success "  .last-run.json file removed"
    fi
    
    # Remove any test artifacts in playwright directory
    if [ -d "playwright" ]; then
        print_status "  Cleaning playwright directory..."
        find playwright -name "*.log" -delete 2>/dev/null || true
        find playwright -name "*.tmp" -delete 2>/dev/null || true
        find playwright -name "*.cache" -delete 2>/dev/null || true
        echo "  ✅ playwright directory cleaned"
    fi

    # Backward compatibility: clean legacy ui-tests directory if present
    if [ -d "ui-tests" ]; then
        print_status "  Cleaning legacy ui-tests directory..."
        find ui-tests -name "*.log" -delete 2>/dev/null || true
        find ui-tests -name "*.tmp" -delete 2>/dev/null || true
        find ui-tests -name "*.cache" -delete 2>/dev/null || true
        echo "  ✅ ui-tests directory cleaned"
    fi
    
    print_success "UI test cleanup completed!"
}

# Function to start servers
start_servers() {
    print_status "Starting servers..."
    
    # Start backend server
    print_status "Starting backend server..."
    cd backend
    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend server
    print_status "Starting frontend server..."
    cd frontend
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Store PIDs for cleanup
    echo $BACKEND_PID > logs/backend.pid
    echo $FRONTEND_PID > logs/frontend.pid
    
    print_success "Servers started (Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID)"
}

# Function to stop servers
stop_servers() {
    print_status "Stopping servers..."
    
    # Stop backend server
    if [ -f "logs/backend.pid" ]; then
        local backend_pid=$(cat logs/backend.pid)
        if kill -0 $backend_pid 2>/dev/null; then
            print_status "Stopping backend server (PID: $backend_pid)..."
            kill $backend_pid 2>/dev/null || true
            rm -f logs/backend.pid
        fi
    fi
    
    # Stop frontend server
    if [ -f "logs/frontend.pid" ]; then
        local frontend_pid=$(cat logs/frontend.pid)
        if kill -0 $frontend_pid 2>/dev/null; then
            print_status "Stopping frontend server (PID: $frontend_pid)..."
            kill $frontend_pid 2>/dev/null || true
            rm -f logs/frontend.pid
        fi
    fi
    
    # Kill any remaining processes on ports
    kill_port 8000  # Backend port
    kill_port 5173  # Frontend port
    
    print_success "All servers stopped"
}

# Function to run UI tests with Playwright UI mode
run_ui_tests_ui() {
    print_status "Running UI tests with Playwright UI mode..."
    
    # Check if Playwright is installed
    if ! command -v npx &> /dev/null; then
        print_error "npx is not available. Please install Node.js and npm first."
        exit 1
    fi
    
    print_warning "Starting Playwright UI mode..."
    print_warning "The UI will open in a new window. Tests will run interactively."
    print_warning "You can control test execution from the Playwright UI window."
    print_warning "Close the Playwright UI window when you're done testing."
    
    # Run tests with UI mode
    if npx playwright test --ui; then
        print_success "UI tests completed successfully!"
        return 0
    else
        print_error "UI tests failed!"
        return 1
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting comprehensive UI test workflow with Playwright UI...${NC}"
    echo ""
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    # Trap to ensure cleanup on exit
    trap 'echo ""; print_warning "Received interrupt signal. Cleaning up..."; stop_servers; exit 1' INT TERM
    
    # Step 1: Stop frontend and backend servers
    print_status "Step 1: Stopping existing servers..."
    stop_servers
    echo ""
    
    # Step 2: Clean up test results
    print_status "Step 2: Cleaning up test results..."
    cleanup_test_results
    echo ""
    
    # Step 3: Start servers
    print_status "Step 3: Starting servers..."
    start_servers
    echo ""
    
    # Step 4: Check servers are up & running
    print_status "Step 4: Checking servers are up & running..."
    
    if ! wait_for_server "http://localhost:8000"; then
        print_error "Backend server failed to start"
        stop_servers
        exit 1
    fi
    
    if ! wait_for_server "http://localhost:5173"; then
        print_error "Frontend server failed to start"
        stop_servers
        exit 1
    fi
    
    print_success "All servers are running and ready!"
    echo ""
    
    # Step 5: Run UI tests with Playwright UI mode
    print_status "Step 5: Running UI tests with Playwright UI mode..."
    echo ""
    
    if run_ui_tests_ui; then
        echo ""
        print_success "🎉 All steps completed successfully!"
        print_success "Test results are available in the test-results/ directory"
        print_success "Test report is available in the playwright-report/ directory"
        
        # Open test report in browser
        print_status "Opening test report in browser..."
        if command -v open &> /dev/null; then
            # macOS
            open playwright-report/index.html
        elif command -v xdg-open &> /dev/null; then
            # Linux
            xdg-open playwright-report/index.html
        elif command -v start &> /dev/null; then
            # Windows (if running in WSL)
            start playwright-report/index.html
        else
            print_warning "Could not automatically open browser. Please open playwright-report/index.html manually."
        fi
        print_success "Test report opened in browser!"
    else
        echo ""
        print_error "❌ UI tests failed! Check the output above for details."
        
        # Still try to open report even if tests failed (for debugging)
        if [ -f "playwright-report/index.html" ]; then
            print_status "Opening test report in browser for debugging..."
            if command -v open &> /dev/null; then
                open playwright-report/index.html
            elif command -v xdg-open &> /dev/null; then
                xdg-open playwright-report/index.html
            elif command -v start &> /dev/null; then
                start playwright-report/index.html
            fi
        fi
    fi
    
    # Note: Don't auto-cleanup servers when using UI mode
    # Let the user control when to stop them
    echo ""
    print_warning "⚠️  Servers are still running for interactive testing."
    print_warning "Use 'npm run start:servers' to stop them when you're done."
    print_warning "Or run this script again to restart the workflow."
    
    echo ""
    print_success "Workflow completed! Playwright UI mode is ready for interactive testing."
}

# Run main function
main "$@"
