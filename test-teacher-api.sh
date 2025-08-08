#!/bin/bash

# Test Teacher API functionality
echo "Testing Teacher API..."

BASE_URL="http://localhost:8000/api"

echo "1. Testing teacher registration..."
curl -X POST "$BASE_URL/teachers/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testteacher",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test Teacher"
  }' | jq '.'

echo -e "\n2. Testing teacher login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/teachers/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testteacher",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq '.'

# Extract teacher ID from login response
TEACHER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.id')

echo -e "\n3. Testing course creation..."
curl -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -H "x-teacher-id: $TEACHER_ID" \
  -d '{
    "title": "Test Course",
    "description": "A test course for teacher functionality",
    "image_url": "/images/placeholder-course.svg",
    "instructor": "Test Teacher",
    "price": 99.99,
    "category": "Functional Programming",
    "teacher_id": '$TEACHER_ID'
  }' | jq '.'

echo -e "\n4. Testing get teacher courses..."
curl -X GET "$BASE_URL/courses/teacher/courses" \
  -H "x-teacher-id: $TEACHER_ID" | jq '.'

echo -e "\n5. Testing search teacher courses..."
curl -X GET "$BASE_URL/courses/teacher/search?keyword=test" \
  -H "x-teacher-id: $TEACHER_ID" | jq '.'

echo -e "\n6. Testing get active courses (public)..."
curl -X GET "$BASE_URL/courses/active" | jq '.'

echo -e "\nTeacher API test completed!"
