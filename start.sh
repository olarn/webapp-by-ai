#!/bin/bash

echo "🚀 Starting Course Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop or OrbStack first."
    echo "   - If using Docker Desktop: Open Docker Desktop application"
    echo "   - If using OrbStack: Open OrbStack application"
    echo ""
    echo "After starting Docker, run this script again."
    exit 1
fi

echo "✅ Docker is running"

# Create data directory if it doesn't exist
mkdir -p data

# Start the application
echo "📦 Starting services with Docker Compose..."
docker-compose up --build

echo "🎉 Application started!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/health"
