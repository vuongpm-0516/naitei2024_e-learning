import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router: Router = Router();

router.get('/instructors', userController.getInstructorList);

router.get('/students', userController.getStudentList);

router.get('/create', userController.userCreateGet);

router.post('/create', userController.userCreatePost);

router.get('/:id/delete', userController.userDeleteGet);

router.post('/:id/delete', userController.userDeletePost);

router.get('/:id/update', userController.userUpdateGet);

router.post('/:id/update', userController.userUpdatePost);

router.get('/:id', userController.getUserById);

router.get('/', userController.getUserList);

export default router;
