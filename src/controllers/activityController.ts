
import { User } from '../models/User';
import { Request, Response } from 'express';
import { createToken } from '../utils/token/CreateUserToken';
import { IUserRegister } from '../utils/userValidator';


export class ActivityController {
  static async CreateActivity(req: Request<{}, {}, {}>, res: Response) {
    try {
      const userExists = await User.findOne({ email: req.body.email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exist.' });
      }

      const { passwordConfirm, ...user } = req.body;

      const SALT = await bcrypt.genSalt(12);

      const passwordHash = bcrypt.hashSync(user.password, SALT);

      const newUser = await new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation,
        password: passwordHash,
      });

      newUser.save();

      const token = createToken(newUser);

      if (!token) {
        return res.status(402).json({ error: 'Token não identificado' });
      }

      res.status(201).json({ message: 'User created!', user: newUser, token });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async GetAllActivities (req: Request, res: Response) {
    const users = await User.find({}).select('-password').sort({name: 1});

    res.send(users);
  }

  static async UpdateActivity (req: Request<{id:string}, {}, {}>, res: Response) {
    try {
      const id = req.params.id;
      
      const { passwordConfirm, ...user } = req.body;

      const SALT = await bcrypt.genSalt(12);

      const passwordHash = bcrypt.hashSync(user.password, SALT);

      const newUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        occupation: user.occupation,
        password: passwordHash,
      };

      const userExists = await User.findById({_id: id});

      if(!userExists) return res.status(422).json({ message: 'ID inválido.' });

      await User.updateOne({_id:id}, newUser);

      return res.status(201).json({ message: 'Usuário atualizado.' });
        
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar.' });
    }
  }
}