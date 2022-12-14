import * as yup from 'yup';

export interface IUserRegister {
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  password: string;
  passwordConfirm: string;
}


export const schema: yup.SchemaOf<IUserRegister> = yup.object().shape({
  name: yup.string().required('O nome deve ser inserido.'),
  email: yup.string().email().required('O e-mail deve ser inserido.'),
  phone: yup.string().min(10, 'Insira um telefone válido.')
    .max(11, 'Insira um telefone válido.')
    .required('Insira um telefone válido.'),
  occupation: yup.string().required('Insira a sua profissão.'),
  password: yup
    .string()
    .min(8, 'a senha deve ter no mínimo 8 caracteres.')
    .max(24, 'a senha deve ter no máximo 24 caracteres.')
    .required('Insira a senha correta.'),
  passwordConfirm: yup
    .string()
    .required('Por favor, confirme a sua senha.')
    .oneOf([yup.ref('password')], 'A senha é diferente.'),
});