import nodemailer from 'nodemailer';
import { Response } from 'express';

export const sendEmail = async (url: string, email: any, res: Response): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.EMAIL_ROOT}`,
      pass: `${process.env.EMAIL_SENHA}`
    },
    tls: {rejectUnauthorized: false}
  });

  const mailOption = {
    from: `${process.env.EMAIL_ROOT}`,
    to: email,
    subject: 'Reset password',
    html:`Click <a href="${url}">here</a> to reset your password.`
  };

  await transporter.sendMail(mailOption, (error, _info) => {
    if (error) {
      return res.status(500).send({error: 'Erro interno.'});
    }

    return res.status(200).send({message: 'E-mail enviado.'});
  });
  
};