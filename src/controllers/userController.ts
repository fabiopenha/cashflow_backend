import { Request, Response } from 'express';

import { User } from '../models/User';
import { IUserRegister } from '../utils/userRegisterValidator';


export class UserController {

  static async Register(req: Request<{}, {}, IUserRegister>, res: Response){
    
    
    try {
      
      console.log('your ass');

      const userExists = await User.findOne({ email: req.body.email });

      if(userExists) res.status(400).json({message: 'User already exist.'});

      console.log(userExists);

      // const newUser = await new User(validatedData).save();

      // res.status(201).json({message: 'User created!'});



    }catch(error) {
      res.json({message: error});
    }
  }
    
  
}