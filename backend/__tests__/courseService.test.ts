import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { createCourseService } from '../src/services/courseService';
import { CourseRepository } from '../src/repositories/courseRepository';
import { Course, CourseCreate } from '../src/types/course';

// Mock repository
const createMockRepository = (): CourseRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe('CourseService', () => {
  let mockRepository: CourseRepository;
  let courseService: ReturnType<typeof createCourseService>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    courseService = createCourseService(mockRepository);
  });

  describe('getAllCourses', () => {
    it('should return sorted courses by creation date', async () => {
      const mockCourses: Course[] = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          image_url: '/image1.jpg',
          instructor: 'Instructor 1',
          price: 49.99,
          category: 'Programming',
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Course 2',
          description: 'Description 2',
          image_url: '/image2.jpg',
          instructor: 'Instructor 2',
          price: 59.99,
          category: 'Programming',
          created_at: '2023-01-02T00:00:00Z'
        }
      ];

      (mockRepository.findAll as jest.Mock).mockReturnValue(TE.right(mockCourses));

      const result = await courseService.getAllCourses()();

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toHaveLength(2);
        expect(result.right[0].id).toBe(2); // Should be sorted by date desc
        expect(result.right[1].id).toBe(1);
      }
    });
  });

  describe('getCourseById', () => {
    it('should return course when valid ID is provided', async () => {
      const mockCourse: Course = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        image_url: '/test.jpg',
        instructor: 'Test Instructor',
        price: 49.99,
        category: 'Programming',
        created_at: '2023-01-01T00:00:00Z'
      };

      (mockRepository.findById as jest.Mock).mockReturnValue(TE.right(O.some(mockCourse)));

      const result = await courseService.getCourseById(1)();

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right._tag).toBe('Some');
        if (result.right._tag === 'Some') {
          expect(result.right.value).toEqual(mockCourse);
        }
      }
    });

    it('should return error for invalid ID', async () => {
      const result = await courseService.getCourseById(-1)();

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('Invalid course ID');
      }
    });
  });

  describe('createCourse', () => {
    it('should create course with valid data', async () => {
      const courseData: CourseCreate = {
        title: 'New Course',
        description: 'New Description',
        image_url: '/new.jpg',
        instructor: 'New Instructor',
        price: 49.99,
        category: 'Programming'
      };

      const createdCourse: Course = {
        id: 1,
        ...courseData,
        created_at: '2023-01-01T00:00:00Z'
      };

      (mockRepository.create as jest.Mock).mockReturnValue(TE.right(createdCourse));

      const result = await courseService.createCourse(courseData)();

      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.right).toEqual(createdCourse);
      }
    });

    it('should return error for empty title', async () => {
      const courseData: CourseCreate = {
        title: '',
        description: 'Description',
        image_url: '/image.jpg',
        instructor: 'Instructor',
        price: 49.99,
        category: 'Programming'
      };

      const result = await courseService.createCourse(courseData)();

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('Course title cannot be empty');
      }
    });

    it('should return error for negative price', async () => {
      const courseData: CourseCreate = {
        title: 'Valid Title',
        description: 'Description',
        image_url: '/image.jpg',
        instructor: 'Instructor',
        price: -10,
        category: 'Programming'
      };

      const result = await courseService.createCourse(courseData)();

      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect(result.left.message).toBe('Course price cannot be negative');
      }
    });
  });
});
