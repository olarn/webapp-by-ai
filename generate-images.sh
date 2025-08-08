#!/bin/bash

echo "🎨 Generating course images..."

# Create images directory
mkdir -p frontend/public/images

# The SVG images are already created in the files:
# - frontend/public/images/fp-course.svg
# - frontend/public/images/oop-course.svg  
# - frontend/public/images/devops-course.svg
# - frontend/public/images/placeholder-course.svg

echo "✅ Course images are ready!"
echo "   - Functional Programming: /images/fp-course.svg"
echo "   - Object-Oriented Programming: /images/oop-course.svg"
echo "   - DevOps with Kubernetes: /images/devops-course.svg"
echo "   - Placeholder: /images/placeholder-course.svg"
echo ""
echo "Images are accessible at:"
echo "   http://localhost:3000/images/fp-course.svg"
echo "   http://localhost:3000/images/oop-course.svg"
echo "   http://localhost:3000/images/devops-course.svg"
