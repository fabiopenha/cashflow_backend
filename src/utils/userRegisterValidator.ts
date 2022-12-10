import * as yup from 'yup';

export interface IUserRegister {
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  password?: string;
}


export const schema: yup.SchemaOf<IUserRegister> = yup.object().shape({
  name: yup.string().required('O nome deve ser inserido.'),
  email: yup.string().email().required('O e-mail deve ser inserido.'),
  phone: yup.string().required('Insira um telefone válido'),
  occupation: yup.string().required('Insira a sua profissão.'),
  password: yup.string().min(8).max(24).required('Insira a senha correta.')
});