#!/bin/bash

echo "🚀 Starting Course Platform..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js is available"

# Create data directory and database if it doesn't exist
mkdir -p data
if [ ! -f data/courses.db ]; then
    echo "📦 Creating database..."
    touch data/courses.db
    chmod 666 data/courses.db
    
    # Create schema and insert sample data
    sqlite3 data/courses.db "CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, image_url TEXT, instructor TEXT, price REAL, category TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
    
    sqlite3 data/courses.db "INSERT INTO courses (title, description, image_url, instructor, price, category) VALUES ('Functional Programming Fundamentals', 'Learn the core concepts of functional programming including pure functions, immutability, and higher-order functions.', 'http://localhost:8000/images/fp-course.svg', 'Dr. John Smith', 49.99, 'Programming');"
    
    sqlite3 data/courses.db "INSERT INTO courses (title, description, image_url, instructor, price, category) VALUES ('Object-Oriented Programming Mastery', 'Master OOP principles including encapsulation, inheritance, and polymorphism with practical examples.', 'http://localhost:8000/images/oop-course.svg', 'Prof. Sarah Johnson', 59.99, 'Programming');"
    
    sqlite3 data/courses.db "INSERT INTO courses (title, description, image_url, instructor, price, category) VALUES ('DevOps with Kubernetes', 'Learn containerization, orchestration, and deployment strategies with Kubernetes.', 'http://localhost:8000/images/devops-course.svg', 'Mike Chen', 79.99, 'DevOps');"
    
    echo "✅ Database created with sample data"
fi

# Create images directory if it doesn't exist
mkdir -p frontend/public/images

# Start backend
echo "🔧 Starting backend..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start frontend
echo "🎨 Starting frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "🎉 Application started successfully!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/health"
echo "   Courses API: http://localhost:8000/api/courses"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
