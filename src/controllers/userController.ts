import { Request, Response } from 'express';

export class UserController {

  static Register(req: Request, res: Response){
    res.send('It workssss!');
  }
}