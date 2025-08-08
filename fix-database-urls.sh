#!/bin/bash

echo "🔧 Fixing database image URLs..."

# Update image URLs to use backend server
sqlite3 data/courses.db "UPDATE courses SET image_url = 'http://localhost:8000/images/fp-course.svg' WHERE id = 1;"
sqlite3 data/courses.db "UPDATE courses SET image_url = 'http://localhost:8000/images/oop-course.svg' WHERE id = 2;"
sqlite3 data/courses.db "UPDATE courses SET image_url = 'http://localhost:8000/images/devops-course.svg' WHERE id = 3;"

echo "✅ Database URLs updated successfully!"
echo "📊 Current image URLs:"
sqlite3 data/courses.db "SELECT id, title, image_url FROM courses;"
