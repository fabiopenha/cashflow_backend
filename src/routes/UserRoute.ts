import { Router } from 'express';
import { UserController } from '../controllers/userController';

const route = Router();

route.get('/v1/auth/register', UserController.Register);

export const userRoutes = route;