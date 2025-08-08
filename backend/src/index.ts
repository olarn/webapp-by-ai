import express from 'express';
import cors from 'cors';
import path from 'path';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createDatabaseConnection } from './database/connection';
import { initializeDatabase } from './database/init';
import { createCourseRepository } from './repositories/courseRepository';
import { createCourseService } from './services/courseService';
import { createCourseController } from './controllers/courseController';
import { createCourseRoutes } from './routes/courseRoutes';
import { createInMemoryTeacherRepository } from './repositories/teacherRepository';
import { createTeacherService } from './services/teacherService';
import { createTeacherController } from './controllers/teacherController';
import { createTeacherRoutes } from './routes/teacherRoutes';
import { EnrollmentRepository } from './repositories/enrollmentRepository';
import { PaymentRepository } from './repositories/paymentRepository';
import { EnrollmentService } from './services/enrollmentService';
import { EnrollmentController } from './controllers/enrollmentController';
import { createEnrollmentRoutes } from './routes/enrollmentRoutes';

const PORT = process.env.PORT || 8000;
const DATABASE_PATH = process.env.DATABASE_PATH || '../data/courses.db';

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Serve static files (images) - works for both development and production
  const imagesPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../public/images')
    : path.join(__dirname, '../public/images');
  app.use('/images', express.static(imagesPath));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return app;
};

const setupDatabase = () =>
  pipe(
    createDatabaseConnection(DATABASE_PATH),
    TE.chain((connection) =>
      pipe(
        initializeDatabase(connection),
        TE.map(() => {
          console.log('Database initialized successfully');
          return connection;
        })
      )
    ),
    TE.mapLeft((error) => {
      console.error('Database setup failed:', error.message);
      return error;
    })
  );

const setupApplication = (connection: any) => {
  const app = createApp();

  // Create course application layers
  const courseRepository = createCourseRepository(connection);
  const courseService = createCourseService(courseRepository);
  const courseController = createCourseController(courseService);

  // Create teacher application layers
  const teacherRepository = createInMemoryTeacherRepository();
  const teacherService = createTeacherService(teacherRepository);
  const teacherController = createTeacherController(teacherService);

  // Create enrollment and payment application layers
  const enrollmentRepository = new EnrollmentRepository(connection.db);
  const paymentRepository = new PaymentRepository(connection.db);
  const enrollmentService = new EnrollmentService(enrollmentRepository, paymentRepository);
  const enrollmentController = new EnrollmentController(enrollmentService);

  // Setup routes
  app.use('/api/courses', createCourseRoutes(courseController));
  app.use('/api/teachers', createTeacherRoutes(teacherController));
  app.use('/api', createEnrollmentRoutes(enrollmentController));

  return app;
};

const startServer = (app: express.Application) =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const server = app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log(`Health check: http://localhost:${PORT}/health`);
          console.log(`API base: http://localhost:${PORT}/api`);
          console.log(`Images: http://localhost:${PORT}/images`);
          console.log(`Teacher API: http://localhost:${PORT}/api/teachers`);
          console.log(`Course API: http://localhost:${PORT}/api/courses`);
          console.log(`Enrollment API: http://localhost:${PORT}/api/enrollments`);
          console.log(`Payment API: http://localhost:${PORT}/api/payments`);
          resolve();
        });

        server.on('error', (error) => {
          reject(error);
        });
      }),
    (error) => new Error(`Failed to start server: ${error}`)
  );

// Main application composition
const main = async () => {
  try {
    const dbResult = await setupDatabase()();
    if (dbResult._tag === 'Left') {
      console.error('Application startup failed:', dbResult.left.message);
      process.exit(1);
    }

    const app = setupApplication(dbResult.right);
    const serverResult = await startServer(app)();

    if (serverResult._tag === 'Left') {
      console.error('Application startup failed:', serverResult.left.message);
      process.exit(1);
    }

    console.log('Application started successfully');
  } catch (error) {
    console.error('Application startup failed:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the application
main();
