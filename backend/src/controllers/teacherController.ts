import { Request, Response } from 'express';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { TeacherService } from '../services/teacherService';
import { TeacherLogin, TeacherRegister, TeacherLoginSchema, TeacherRegisterSchema } from '../types/course';

export interface TeacherController {
  register: (req: Request, res: Response) => void;
  login: (req: Request, res: Response) => void;
  getTeacherById: (req: Request, res: Response) => void;
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

export const createTeacherController = (
  teacherService: TeacherService
): TeacherController => ({
  register: (req: Request, res: Response) => {
    const validationResult = TeacherRegisterSchema.decode(req.body);
    if (validationResult._tag === 'Left') {
      sendError(res, new Error(`Validation errors: ${JSON.stringify(validationResult.left)}`), 400);
      return;
    }

    teacherService.register(validationResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          sendResponse(res, result.right, 201);
        }
      }
    );
  },

  login: (req: Request, res: Response) => {
    const validationResult = TeacherLoginSchema.decode(req.body);
    if (validationResult._tag === 'Left') {
      sendError(res, new Error(`Validation errors: ${JSON.stringify(validationResult.left)}`), 400);
      return;
    }

    teacherService.login(validationResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 401);
        } else {
          sendResponse(res, result.right);
        }
      }
    );
  },

  getTeacherById: (req: Request, res: Response) => {
    const idResult = parseId(req.params.id);
    if (idResult._tag === 'Left') {
      sendError(res, idResult.left, 400);
      return;
    }

    teacherService.getTeacherById(idResult.right)().then(
      (result) => {
        if (result._tag === 'Left') {
          sendError(res, result.left, 400);
        } else {
          if (result.right._tag === 'None') {
            sendError(res, new Error('Teacher not found'), 404);
          } else {
            sendResponse(res, result.right.value);
          }
        }
      }
    );
  }
});
