import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { IUserRegister } from '../utils/userRegisterValidator';


export class UserController {

  static async Register(req: Request<{}, {}, IUserRegister>, res: Response){
    
    
    try {

      const userExists = await User.findOne({ email: req.body.email });

      if(userExists) {
        return res.status(400).json({message: 'User already exist.'});
      }

      const { passwordConfirm, ...user} = req.body;

      const SALT = await bcrypt.genSalt(12);

      const passwordHash = bcrypt.hashSync(user.password, SALT);

      const newUser = await new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation,
        password: passwordHash
      });

      newUser.save();

      res.status(201).json({message: 'User created!', newUser});

    }catch(error) {
      res.status(500).json({message: error});
    }
  }
    
  
}