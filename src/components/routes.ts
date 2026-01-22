import express, { Router } from 'express';
import exampleRouter from './example';
import userRouter from './users';
// import authMiddleware from '@middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.use('/example', exampleRouter);
router.use('/users', userRouter);

// Protected routes (uncomment to use)
// router.use(authMiddleware);
// router.use('/protected', protectedRouter);

export default router;
