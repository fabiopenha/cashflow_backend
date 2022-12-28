import nodemailer from 'nodemailer';
import { Response } from 'express';

export const sendEmail = async (url: string, email: any, res: Response): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'cashflowbrz@gmail.com',
      pass: `${process.env.EMAIL_SENHA}`
    },
    tls: {rejectUnauthorized: false}
  });

  const mailOption = {
    from: 'cashflowbrz@gmail.com',
    to: email,
    subject: 'Test',
    text: 'Se você consegue ler é porque o e-mail foi enviado.'
  };

  await transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      return res.status(500).send({error: 'Erro interno.'});
    }

    return res.status(200).send({message: 'E-mail enviado.'});
  });
  
};