import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createDatabaseConnection } from './connection';
import { runQuery } from './connection';

const sampleCourses = [
  {
    title: "Functional Programming Fundamentals",
    description: "Learn the core concepts of functional programming including pure functions, immutability, and higher-order functions. Perfect for developers transitioning from imperative to functional programming.",
    image_url: "/images/fp-course.svg",
    instructor: "Dr. John Doe",
    price: 89.99,
    category: "Functional Programming",
    teacher_id: 1,
    status: "active"
  },
  {
    title: "Advanced TypeScript Patterns",
    description: "Master advanced TypeScript patterns including generics, decorators, and advanced type manipulation. Build robust, type-safe applications with confidence.",
    image_url: "/images/oop-course.svg",
    instructor: "Dr. John Doe",
    price: 129.99,
    category: "Object-Oriented Programming",
    teacher_id: 1,
    status: "active"
  },
  {
    title: "DevOps with Kubernetes",
    description: "Learn containerization and orchestration with Docker and Kubernetes. Deploy, scale, and manage applications in production environments.",
    image_url: "/images/devops-course.svg",
    instructor: "Dr. John Doe",
    price: 149.99,
    category: "DevOps",
    teacher_id: 1,
    status: "active"
  },
  {
    title: "React with Functional Components",
    description: "Build modern React applications using functional components and hooks. Learn state management, performance optimization, and best practices.",
    image_url: "/images/web-development.svg",
    instructor: "Jane Smith",
    price: 99.99,
    category: "Web Development",
    teacher_id: 2,
    status: "active"
  },
  {
    title: "Data Science with Python",
    description: "Introduction to data science using Python. Learn pandas, numpy, matplotlib, and scikit-learn for data analysis and machine learning.",
    image_url: "/images/data-science.svg",
    instructor: "Jane Smith",
    price: 119.99,
    category: "Data Science",
    teacher_id: 2,
    status: "active"
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native. Learn navigation, state management, and native module integration.",
    image_url: "/images/mobile-development.svg",
    instructor: "Jane Smith",
    price: 139.99,
    category: "Mobile Development",
    teacher_id: 2,
    status: "active"
  },
  {
    title: "Monads and Functors in Practice",
    description: "Deep dive into monads, functors, and other functional programming abstractions. Learn how to use them in real-world applications.",
    image_url: "/images/fp-course.svg",
    instructor: "Dr. John Doe",
    price: 159.99,
    category: "Functional Programming",
    teacher_id: 1,
    status: "active"
  },
  {
    title: "Microservices Architecture",
    description: "Design and implement microservices architecture. Learn service discovery, API gateways, and distributed system patterns.",
    image_url: "/images/devops-course.svg",
    instructor: "Dr. John Doe",
    price: 169.99,
    category: "DevOps",
    teacher_id: 1,
    status: "active"
  },
  {
    title: "Vue.js 3 Composition API",
    description: "Master Vue.js 3 with the Composition API. Build scalable applications with better code organization and reusability.",
    image_url: "/images/web-development.svg",
    instructor: "Jane Smith",
    price: 109.99,
    category: "Web Development",
    teacher_id: 2,
    status: "active"
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Learn the fundamentals of machine learning including supervised and unsupervised learning, model evaluation, and feature engineering.",
    image_url: "/images/data-science.svg",
    instructor: "Jane Smith",
    price: 179.99,
    category: "Data Science",
    teacher_id: 2,
    status: "active"
  }
];

const seedCourses = () =>
  pipe(
    createDatabaseConnection('../data/courses.db'),
    TE.chain((connection) =>
      pipe(
        // Clear existing courses (optional - comment out if you want to keep existing)
        runQuery(connection, 'DELETE FROM courses'),
        TE.chain(() =>
          // Insert sample courses
          TE.sequenceArray(
            sampleCourses.map(course =>
              runQuery(
                connection,
                `INSERT INTO courses (title, description, image_url, instructor, price, category, teacher_id, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                [
                  course.title,
                  course.description,
                  course.image_url,
                  course.instructor,
                  course.price,
                  course.category,
                  course.teacher_id,
                  course.status
                ]
              )
            )
          )
        ),
        TE.map(() => {
          console.log(`Successfully seeded ${sampleCourses.length} courses`);
          return connection;
        })
      )
    )
  );

// Run seeding
seedCourses()().then(
  (result) => {
    if (result._tag === 'Left') {
      console.error('Seeding failed:', result.left.message);
      process.exit(1);
    } else {
      console.log('Database seeding completed successfully');
      process.exit(0);
    }
  }
);
