import { NextFunction, Request, Response } from 'express';
import { IUserRegister } from '../utils/userRegisterValidator';
import * as yup from 'yup';

export const RegisterValidate = (schema: yup.SchemaOf<IUserRegister>) => async (req: Request, res: Response, next: NextFunction) => {
  let validatedData: IUserRegister | undefined = undefined;
    
  try {
    validatedData = await schema.validate(req.body, {abortEarly: false});
    return next();
  
  }catch(error) {
    const yupError = error as yup.ValidationError;
    const validationErrors: Record<string, string> = {};
  
    yupError.inner.forEach(error => {
      if(!error.path) return;
      validationErrors[error.path] = error.message;
        
    });
  
    return res.status(402).json({errors: validationErrors});
  }
  
};