import { NextFunction, Response, Request } from 'express';
import asyncHandler from 'express-async-handler';
import * as userServices from '../services/user.services';
import * as courseServices from '../services/course.services';
import { users, courseRecommends } from '../mock/data';
import { UserRole } from '../enums/UserRole';

export const getUserList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render('users/index', { users });
  }
);

export const getInstructorList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructors = await userServices.getInstructorList();
    res.render('instructors/list', {
      title: req.t('title.list_instructor'),
      instructors,
      currentPath: req.baseUrl + req.path,
    });
  }
);

export const getStudentList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await userServices.getStudentList();
    res.render('students/list', {
      title: req.t('title.list_student'),
      students,
      currentPath: req.baseUrl + req.path,
    });
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.getUserById(req.params.id);
    if (!user) {
      return next(Error(req.t('error.userNotFound')));
    }

    const userCourses = await courseServices.getUserCourseList(user);

    res.render('users/detail', {
      title: req.t('title.user_detail'),
      userCourses,
      user,
      UserRole,
    });
  }
);

export const userCreateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render('users/form', { title: 'Create user', UserRole });
  }
);

export const userCreatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('User is created with method POST');
  }
);

export const userDeleteGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = users.find(user => user.id === req.params.id);
    res.render('users/delete', { user });
  }
);

export const userDeletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`User ${req.params.id} is deleted with method POST`);
  }
);

export const userUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = users.find(user => user.id === req.params.id);
    res.render('users/form', { title: 'Update user', user, UserRole });
  }
);

export const userUpdatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`User ${req.params.id} is updated with method POST`);
  }
);
