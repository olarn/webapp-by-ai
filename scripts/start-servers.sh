#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Development Servers${NC}"

# Function to stop processes on a specific port
stop_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}🛑 Stopping processes on port $port...${NC}"
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    else
        echo -e "${GREEN}✅ No processes running on port $port${NC}"
    fi
}

# Function to wait for server to be ready
wait_for_server() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $name to be ready at $url...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - $name not ready yet...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start within timeout${NC}"
    return 1
}

# Stop existing processes
echo -e "${YELLOW}🛑 Stopping existing frontend and backend processes...${NC}"
stop_port 8000  # Backend
stop_port 5173  # Frontend

# Wait a moment for processes to fully stop
sleep 3

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend server in background
echo -e "${BLUE}🚀 Starting backend server...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend server in background
echo -e "${BLUE}🚀 Starting frontend server...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for both servers to be ready
echo -e "${BLUE}⏳ Waiting for servers to start...${NC}"

if ! wait_for_server "http://localhost:8000" "Backend"; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo -e "${YELLOW}📋 Backend logs:${NC}"
    cat logs/backend.log
    exit 1
fi

if ! wait_for_server "http://localhost:5173" "Frontend"; then
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo -e "${YELLOW}📋 Frontend logs:${NC}"
    cat logs/frontend.log
    exit 1
fi

echo -e "${GREEN}✅ Both servers are running!${NC}"
echo -e "${BLUE}🌐 Backend: http://localhost:8000${NC}"
echo -e "${BLUE}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}📝 Logs are available in the logs/ directory${NC}"
echo -e "${YELLOW}🛑 Press Ctrl+C to stop both servers${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    
    # Wait for processes to stop
    sleep 3
    
    # Final cleanup
    stop_port 8000
    stop_port 5173
    
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo -e "${BLUE}⏳ Servers are running. Press Ctrl+C to stop...${NC}"
while true; do
    sleep 1
done
