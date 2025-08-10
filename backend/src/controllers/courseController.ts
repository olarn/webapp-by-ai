import { Request, Response } from 'express';
import * as E from 'fp-ts/Either';
import { CourseService } from '../services/courseService';
import { CourseCreateSchema, CourseUpdateSchema } from '../types/course';

export interface CourseController {
  getAllCourses: (req: Request, res: Response) => void;
  getActiveCourses: (req: Request, res: Response) => void;
  getCourseById: (req: Request, res: Response) => void;
  getTeacherCourses: (req: Request, res: Response) => void;
  searchTeacherCourses: (req: Request, res: Response) => void;
  createCourse: (req: Request, res: Response) => void;
  updateCourse: (req: Request, res: Response) => void;
  updateCourseStatus: (req: Request, res: Response) => void;
  deleteCourse: (req: Request, res: Response) => void;
}

const sendResponse = <T>(res: Response, data: T, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

const sendError = (res: Response, error: Error, statusCode: number = 500) => {
  res.status(statusCode).json({
    success: false,
    error: error.message
  });
};

const parseId = (id: string): E.Either<Error, number> => {
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0) {
    return E.left(new Error('ID must be a positive number'));
  }
  return E.right(num);
};

const getTeacherIdFromRequest = (req: Request): E.Either<Error, number> => {
  // In a real implementation, this would come from JWT token or session
  const teacherId = req.headers['x-teacher-id'] || req.body.teacher_id;
  if (!teacherId) {
    return E.left(new Error('Teacher ID is required'));
  }
  return parseId(teacherId.toString());
};

export const createCourseController = (
  courseService: CourseService
): CourseController => ({
  getAllCourses: (req: Request, res: Response) => {
    courseService.getAllCourses()().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 500);
        } else {
          sendResponse(res, result.right);
        }
      }
    );
  },

  getActiveCourses: (req: Request, res: Response) => {
    courseService.getActiveCourses()().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 500);
        } else {
          sendResponse(res, result.right);
        }
      }
    );
  },

  getCourseById: (req: Request, res: Response) => {
    const idResult = parseId(req.params.id);
    if (idResult._tag === 'Left') {
      sendError(res, idResult.left, 400);
      return;
    }

    courseService.getCourseById(idResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          if (result.right._tag === 'None') {
            sendError(res, new Error('Course not found'), 404);
          } else {
            sendResponse(res, result.right.value);
          }
        }
      }
    );
  },

  getTeacherCourses: (req: Request, res: Response) => {
    const teacherIdResult = getTeacherIdFromRequest(req);
    if (teacherIdResult._tag === 'Left') {
      sendError(res, teacherIdResult.left, 400);
      return;
    }

    courseService.getTeacherCourses(teacherIdResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 500);
        } else {
          sendResponse(res, result.right);
        }
      }
    );
  },

  searchTeacherCourses: (req: Request, res: Response) => {
    const teacherIdResult = getTeacherIdFromRequest(req);
    if (teacherIdResult._tag === 'Left') {
      sendError(res, teacherIdResult.left, 400);
      return;
    }

    const keyword = req.query.keyword as string;
    if (!keyword || keyword.trim().length === 0) {
      sendError(res, new Error('Search keyword is required'), 400);
      return;
    }

    courseService.searchTeacherCourses(teacherIdResult.right, keyword)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 500);
        } else {
          sendResponse(res, result.right);
        }
      }
    );
  },

  createCourse: (req: Request, res: Response) => {
    const validationResult = CourseCreateSchema.decode(req.body);
    if (validationResult._tag === 'Left') {
      sendError(res, new Error(`Validation errors: ${JSON.stringify(validationResult.left)}`), 400);
      return;
    }

    courseService.createCourse(validationResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          sendResponse(res, result.right, 201);
        }
      }
    );
  },

  updateCourse: (req: Request, res: Response) => {
    const idResult = parseId(req.params.id);
    if (idResult._tag === 'Left') {
      sendError(res, idResult.left, 400);
      return;
    }

    const teacherIdResult = getTeacherIdFromRequest(req);
    if (teacherIdResult._tag === 'Left') {
      sendError(res, teacherIdResult.left, 400);
      return;
    }

    const validationResult = CourseUpdateSchema.decode(req.body);
    if (validationResult._tag === 'Left') {
      sendError(res, new Error(`Validation errors: ${JSON.stringify(validationResult.left)}`), 400);
      return;
    }

    courseService.updateCourse(idResult.right, teacherIdResult.right, validationResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          if (result.right._tag === 'None') {
            sendError(res, new Error('Course not found or access denied'), 404);
          } else {
            sendResponse(res, result.right.value);
          }
        }
      }
    );
  },

  updateCourseStatus: (req: Request, res: Response) => {
    const idResult = parseId(req.params.id);
    if (idResult._tag === 'Left') {
      sendError(res, idResult.left, 400);
      return;
    }

    const teacherIdResult = getTeacherIdFromRequest(req);
    if (teacherIdResult._tag === 'Left') {
      sendError(res, teacherIdResult.left, 400);
      return;
    }

    const status = req.body.status as 'active' | 'disabled';
    if (!status || !['active', 'disabled'].includes(status)) {
      sendError(res, new Error('Status must be either "active" or "disabled"'), 400);
      return;
    }

    courseService.updateCourseStatus(idResult.right, teacherIdResult.right, status)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          if (result.right._tag === 'None') {
            sendError(res, new Error('Course not found or access denied'), 404);
          } else {
            sendResponse(res, result.right.value);
          }
        }
      }
    );
  },

  deleteCourse: (req: Request, res: Response) => {
    const idResult = parseId(req.params.id);
    if (idResult._tag === 'Left') {
      sendError(res, idResult.left, 400);
      return;
    }

    const teacherIdResult = getTeacherIdFromRequest(req);
    if (teacherIdResult._tag === 'Left') {
      sendError(res, teacherIdResult.left, 400);
      return;
    }

    courseService.deleteCourse(idResult.right, teacherIdResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          sendResponse(res, { deleted: result.right });
        }
      }
    );
  }
});
