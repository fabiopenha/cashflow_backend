import { IUserRegister } from '../userValidator';
import jwt from 'jsonwebtoken';

export const createToken = (user: any) => {
  const token = jwt.sign({ id: user._id, name: user.name }, 'secret', {
    expiresIn: '30s',
  });

  return token;
};
