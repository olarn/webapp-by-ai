#!/bin/bash

echo "🐳 Testing Docker Compose..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop or OrbStack first."
    exit 1
fi

echo "✅ Docker is running"

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true

# Create data directory
mkdir -p data

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Test backend health
echo "🏥 Testing backend health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Test backend API
echo "📡 Testing backend API..."
if curl -f http://localhost:8000/api/courses > /dev/null 2>&1; then
    echo "✅ Backend API is working"
else
    echo "❌ Backend API failed"
fi

# Test frontend
echo "🎨 Testing frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is working"
else
    echo "❌ Frontend failed"
fi

# Show container status
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/health"
echo "   Courses API: http://localhost:8000/api/courses"
echo ""
echo "To stop the services, run: docker-compose down"
