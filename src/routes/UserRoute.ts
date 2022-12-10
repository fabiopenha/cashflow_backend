import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { RegisterValidate } from '../Middlewares/validationMiddleware';
import { schema } from '../utils/userRegisterValidator';

const route = Router();

route.post('/v1/auth/register',RegisterValidate(schema), UserController.Register);

export const userRoutes = route;