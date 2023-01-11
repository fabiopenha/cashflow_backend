import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { Request, Response } from 'express';
import { createToken } from '../utils/token/CreateUserToken';
import { IUserLogin, IUserRegister, IUserPassword } from '../utils/userValidator';
import * as crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail';

export class UserController {
  static async Register(req: Request<{}, {}, IUserRegister>, res: Response) {
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

  static async Login(req: Request<{}, {}, IUserLogin>, res: Response) {
    try {
      
      const user = req.body;

      const userExists = await User.findOne({email: user.email});

      if(!userExists) {
        return res.status(401).json({message: 'E-mail ou senha não encontrados'});
      }
      
      if(!await bcrypt.compare(user.password, userExists.password)){
        return res.status(401).json({message: 'E-mail ou senha não encontrados.'});
      }

      const secret = speakeasy.generateSecret({
        name: 'cashflow'
      });

      res.status(200).json({
        id: userExists._id,
        secret: secret.ascii,
        otpauth_url: secret.otpauth_url
      });

    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // only for test QR code
  static QrCode(req: Request, res: Response) {
    QRCode.toDataURL('otpauth://totp/cashflow?secret=PNDEWVZ7HZ5WM4ZZMY6DESRRIFNVISS5NYYD4ZLIMREVUZBGFRCA', (err:any, data:any) => {
      return res.send(`<img src="${data}"/>`);
    });
  }

  static async TwoFactor(req: Request, res: Response) {
    
    const { id, secret, code } = req.body;

    const user = await User.findById(id).select('-password');

    if(!user) return res.status(400).json({message:'Acesso inválido'});

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'ascii',
      token: code
    });

    if(!verified) {
      return res.status(400).json({message: 'Credencial inválida'});
    }

    const accessToken = jwt.sign({ id },
      process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

    const refreshToken = jwt.sign({ id }, 
      process.env.REFRESH_SECRET || '', {expiresIn: '1w'});

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 24*60*60*1000 // 1 day
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24*60*60*1000 // 7 day
    });

    res.send('Success');
  }

  static async Authenticator (req: Request, res: Response) {
    try {
      const cookie = req.cookies['access_token'];
    
      const verified: any = jwt.verify(cookie, process.env.ACCESS_SECRET || '');

      if(!verified) return res.status(401).json({message: 'Não autorizado'});

      const user = await User.findById({_id: verified.id});

      if(!user) return res.status(401).json({message: 'Não autorizado'});

      let loggedIn = false;

      cookie ? loggedIn = true : loggedIn = false;

      res.status(200).send({user, loggedIn});

    } catch (error) {
      return res.status(401).json({message: 'Não autorizado'});
    }

  }


  static async AuthenticatedUser(req: Request, res: Response){
    try{
      const cookie = req.cookies['access_token'];
 
      const payload: any = jwt.verify(cookie, process.env.ACCESS_SECRET || '');
 
      if(!payload) res.status(401).json({message:'Unauthenticated'});
 
      const user = await User.findById({
        id: payload.id
      });

      let loggedin = false;
      if(cookie) {
        loggedin = true;
      }
 
      if(!user) res.status(401).json({message:'Unauthenticated'});
 
      res.send({user, loggedin});
    }catch(e){
      return res.status(401).json({message:'Unauthenticated'});
    }
  }


  static async RefreshToken (req: Request, res: Response) {
    try {
      const cookie = req.cookies['refresh_token'];

      const verified: any = jwt.verify(cookie, process.env.REFRESH_SECRET || '');

      if(!verified) return res.status(401).json({message: 'Não autorizado'});

      const accessToken = jwt.sign({
        id: verified.id
      }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});  

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        maxAge: 24*60*60*1000 //1 day
      });

      res.status(200).send({message: 'success'});
    } catch (error) {
      return res.status(401).json({message: 'Não autorizado'});
    }
  }

  static async Logout (req: Request, res: Response) {
    res.cookie('access_token', '', {maxAge: 0});
    res.cookie('refresh_token', '', {maxAge: 0});

    res.send({ message: 'Success'});
  }

  static async GetAllUsers (req: Request, res: Response) {
    const users = await User.find({}).select('-password').sort({name: 1});

    res.send(users);
  }

  static async UpdateUser (req: Request<{id:string}, {}, IUserRegister>, res: Response) {
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

  static async ForgotPassword (req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if(!user) return res.status(404).send({message: 'email não encontrado.'});

      const token = await Token.findOne({ userId: user?._id });

      if(token) await token.deleteOne();

      const resetToken = crypto.randomBytes(32).toString('hex');

      await new Token({
        token: resetToken,
        userId: user._id,
        createdAt: Date.now()
      }).save();


      const url = `http://localhost:3000/reset/${resetToken}`;

      sendEmail(url, email, res);

    } catch (error) {
      res.status(500).send({message: 'Erro interno.'});
    }
  }

  static async ResetPassword (req: Request<{token: string}, {}, IUserPassword>, res: Response) {
    const token = req.params.token;
    const {password, passwordConfirm} = req.body;

    if(password !== passwordConfirm) return res.status(401).send('Url inválido.');

    const user = await Token.findOne({token});

    if(!user) return res.send('usuário não existe');

    const SALT = await bcrypt.genSalt(12);

    const passwordHash = bcrypt.hashSync(password, SALT);

    await User.updateOne(
      { _id: user.userId },
      { $set: { password: passwordHash } },
      { new: true }
    );

    res.status(200).send({message: 'Senha atualizada.'});

  }
}