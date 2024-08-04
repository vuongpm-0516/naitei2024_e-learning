import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import * as courseServices from '../services/course.services';

export const courseList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseRecommends = await courseServices.getCourseList();
    res.render('courses/index', {
      title: req.t('title.list_course'),
      courseRecommends,
      currentPath: req.baseUrl,
    });
  }
);

export const courseDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await courseServices.getCourseById(req.params.id);
    if (!course) {
      return next(Error(req.t('error.courseNotFound')));
    }

    res.render('courses/detail', {
      title: req.t('title.course_detail'),
      course,
    });
  }
);

export const courseCreateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('course is created with method GET');
  }
);

export const courseCreatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('course is created with method POST');
  }
);

export const courseDeleteGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`course ${req.params.id} is deleted with method GET`);
  }
);

export const courseDeletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`course ${req.params.id} is deleted with method POST`);
  }
);

export const courseUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`course ${req.params.id} is updated with method GET `);
  }
);

export const courseUpdatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`course ${req.params.id} is updated with method POST`);
  }
);
