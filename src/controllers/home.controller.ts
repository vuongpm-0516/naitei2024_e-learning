import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import * as userServices from '../services/user.services';
import { courseRecommends, courseLearns } from '../mock/data';

export const index = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructors = await userServices.getInstructorList();
    const students = await userServices.getStudentList();
    res.render('index', {
      title: 'Smart Education',
      courseRecommends,
      courseLearns,
      instructors,
      students,
      currentPath: req.baseUrl + req.path,
    });
  }
);
