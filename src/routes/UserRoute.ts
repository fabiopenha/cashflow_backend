import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { RegisterValidate, LoginValidate } from '../Middlewares/validationMiddleware';
import { registerValidator, LoginValidator } from '../utils/userValidator';

const route = Router();

route.post(
  '/v1/auth/register',
  RegisterValidate(registerValidator),
  UserController.Register
);

route.post(
  '/v1/auth/login',
  LoginValidate(LoginValidator),
  UserController.Login
);

route.get(
  '/test',
  UserController.QrCode
);

route.post(
  '/v1/auth/twofactor',
  UserController.TwoFactor
);

route.post(
  '/v1/auth/authenticator',
  UserController.Authenticator
);

route.post(
  '/v1/auth/refreshtoken',
  UserController.RefreshToken
);

route.post(
  '/v1/auth/logout',
  UserController.Logout
);

route.get(
  '/v1/auth/getallusers',
  UserController.GetAllUsers
);

route.put(
  '/v1/auth/updateuser/:id',
  RegisterValidate(registerValidator),
  UserController.UpdateUser
);

route.post(
  '/v1/auth/forgotpassword',
  UserController.ForgotPassword
);

export const userRoutes = route;
