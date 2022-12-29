import { IUserPassword } from './../utils/userValidator';
import { NextFunction, Request, Response } from 'express';
import { IUserRegister, IUserLogin } from '../utils/userValidator';
import * as yup from 'yup';

export const RegisterValidate =
  (schema: yup.SchemaOf<IUserRegister>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      let validatedData: IUserRegister | undefined = undefined;

      try {
        validatedData = await schema.validate(req.body, { abortEarly: false });
        return next();
      } catch (error) {
        const yupError = error as yup.ValidationError;
        const validationErrors: Record<string, string> = {};

        yupError.inner.forEach((error) => {
          if (!error.path) return;
          validationErrors[error.path] = error.message;
        });

        return res.status(402).json({ errors: validationErrors });
      }
    };

export const LoginValidate =
(schema: yup.SchemaOf<IUserLogin>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let validatedData: IUserLogin | undefined = undefined;

    try {
      validatedData = await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (error) {
      const yupError = error as yup.ValidationError;
      const validationErrors: Record<string, string> = {};

      yupError.inner.forEach((error) => {
        if (!error.path) return;
        validationErrors[error.path] = error.message;
      });

      return res.status(402).json({ errors: validationErrors });
    }
  };

export const PasswordValidate =
  (schema: yup.SchemaOf<IUserPassword>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      let validatedData: IUserPassword | undefined = undefined;
  
      try {
        validatedData = await schema.validate(req.body, { abortEarly: false });
        return next();
      } catch (error) {
        const yupError = error as yup.ValidationError;
        const validationErrors: Record<string, string> = {};
  
        yupError.inner.forEach((error) => {
          if (!error.path) return;
          validationErrors[error.path] = error.message;
        });
  
        return res.status(402).json({ errors: validationErrors });
      }
    };
