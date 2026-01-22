import express, { Router } from 'express';
import UserController from './User.controller';

const userRouter: Router = express.Router();

// Public routes
userRouter.post('/register', UserController.register.bind(UserController));
userRouter.post('/login', UserController.login.bind(UserController));

// Protected routes (add authMiddleware if needed)
userRouter.get('/', UserController.getAll.bind(UserController));
userRouter.get('/:id', UserController.getById.bind(UserController));
userRouter.put('/:id', UserController.update.bind(UserController));
userRouter.delete('/:id', UserController.delete.bind(UserController));

export default userRouter;
