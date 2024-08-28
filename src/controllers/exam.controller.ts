import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createAnswersFromExam,
  getExamById,
  getBestGradeByCourseId,
  updateGradeWhenStartExam,
  updateGradeWhenSubmitExam,
  getQuestionsByExamId,
  getResultOfExam,
  getResultOfExamByGradeId,
  updateGradeById,
  createExam,
  updateExam,
} from '../services/exam.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ExamDTO } from '../dtos/exam.dto';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { validateUserCurrent } from './user.controller';
import { getUserById } from '../services/user.service';
import { getLessonList } from '../services/lesson.service';

const preprocess = (attribute: Record<string, string>) => {
  const time_limit = parseInt(attribute.time_limit);
  const attempt_limit = parseInt(attribute.attempt_limit);

  const body = {
    ...attribute,
    time_limit: isNaN(time_limit) ? null : time_limit,
    attempt_limit: isNaN(attempt_limit) ? null : attempt_limit,
  };

  const examData = plainToClass(ExamDTO, body);

  return examData;
};

export const examList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('exam list');
  }
);

export const getExamInfo = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const lessonList = await getLessonList(userSession.id, req.courseID!);
    const grade = await getBestGradeByCourseId(req.courseID!, userSession.id);
    res.render('lessons/index', {
      title: req.t('lesson.finalExam'),
      lessonList,
      examStatus: grade?.status,
      grade,
      courseID: req.courseID,
    });
  }
);

export const getExamDetail = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const questions = await getQuestionsByExamId(req.params.id);
    const exam = await getExamById(req.params.id);
    await updateGradeWhenStartExam(exam!, userSession);

    res.render('exams/detail', {
      title: req.t('exam.doExam'),
      questions,
      exam,
      courseID: req.courseID,
      selectedAnswers: req.session.selectedAnswers || {},
    });
  }
);

export const saveAnswer = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const { questionId, answerId } = req.body;

    if (!req.session.selectedAnswers) {
      req.session.selectedAnswers = {};
    }

    req.session.selectedAnswers[questionId] = answerId;

    res.json({ success: true, message: 'Answer saved' });
  }
);

export const examCreateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    res.render('exams/form', {
      title: req.t('title.create_exam'),
      courseID: req.courseID,
    });
  }
);

export const examCreatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examData = preprocess(req.body);

    const errors = await validate(examData);
    if (errors.length > 0) {
      return res.render('exams/form', {
        title: req.t('title.create_exam'),
        exam: req.body,
        courseID: req.courseID,
        errors: errors.map(err => ({
          param: err.property,
          msg: Object.values(err.constraints || {})[0],
        })),
      });
    }

    await createExam(req.body, req.courseID!);

    res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const examDeleteGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    res.send(`exam ${req.params.id} is deleted with method GET`);
  }
);

export const examDeletePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    res.send(`exam ${req.params.id} is deleted with method POST`);
  }
);

export const examUpdateGet = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const exam = await getExamById(req.params.id);
    res.render('exams/edit', {
      title: req.t('title.edit_exam'),
      exam,
      courseID: req.courseID!,
    });
  }
);

export const examUpdatePost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const examData = preprocess(req.body);

    const errors = await validate(examData);
    if (errors.length > 0) {
      return res.render('exams/edit', {
        title: req.t('title.edit_exam'),
        exam: req.body,
        courseID: req.courseID!,
        errors: errors.map(err => ({
          param: err.property,
          msg: Object.values(err.constraints || {})[0],
        })),
      });
    }

    await updateExam(req.params.id, req.body);

    res.redirect(`/courses/${req.courseID}/manage`);
  }
);

export const submitExam = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await validateUserCurrent(req, res, next);
    req.session.selectedAnswers = {};
    const questions = await getQuestionsByExamId(req.params.id);
    const answers = req.body as { [key: string]: string };
    for (const question of questions) {
      const optionId = answers[question.id];
      const user = await getUserById(res.locals.user.id);
      await createAnswersFromExam(question!, user!, optionId);
    }
    res.redirect(`${req.params.id}/result`);
  }
);

export const resultExam = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const userSession = req.session.user!;
    const gradeId = req.query.grade as string;
    if (gradeId) {
      const result = await getResultOfExamByGradeId(gradeId);
      const detailAnswers = result?.answers;
      const score = result?.score;
      const exam = result?.grade.assignment;
      const grade = result?.grade;
      res.render('exams/result', {
        title: req.t('exam.viewResult'),
        detailAnswers,
        score,
        exam,
        grade,
        courseID: req.courseID,
        gradeId,
      });
    } else {
      const exam = await getExamById(req.params.id);
      const result = await getResultOfExam(userSession.id, req.params.id);
      const detailAnswers = result?.filteredAnswers;
      const score = result?.score;
      const totalQuestions = result?.filteredAnswers.length;
      await updateGradeWhenSubmitExam(
        exam!,
        userSession,
        score,
        totalQuestions
      );

      res.render('exams/result', {
        title: req.t('exam.viewResult'),
        detailAnswers,
        score,
        exam,
        courseID: req.courseID,
      });
    }
  }
);

export const addFeedBackPost = asyncHandler(
  async (req: RequestWithCourseID, res: Response, next: NextFunction) => {
    const gradeId = req.query.grade as string;
    const courseId = req.courseID;
    const feedback = req.body.feedback;
    await updateGradeById(gradeId, feedback);
    res.redirect(`/courses/${courseId}/manage`);
  }
);
