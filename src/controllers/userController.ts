import { Request, Response } from 'express';

import { User } from '../models/User';
import { IUserRegister, schema } from '../utils/userRegisterValidator';


export class UserController {

  static async Register(req: Request<{}, {}, IUserRegister>, res: Response){

    
    try {
      
      console.log('your ass');

      // const userExists = User.findOne({email:validatedData.email});

      // if(!userExists) return res.status(404).json({message: 'User already exist'});

      // const newUser = await new User(validatedData).save();

      // res.status(201).json({message: 'User created!'});



    }catch(error) {
      res.json({message: error});
    }
  }
    
  
}