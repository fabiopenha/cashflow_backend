import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { IActivity } from '../utils/activityValidator';

export const ActivityValidate =
  (schema: yup.SchemaOf<IActivity>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      let validatedData: IActivity | undefined = undefined;

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
