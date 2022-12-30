import * as yup from 'yup';

export interface IActivity {
  date: Date;
  category?: string;
  description?: string;
  cash?: number;
}

export const activityValidator: yup.SchemaOf<IActivity> = yup.object().shape({
  date: yup.date().required('A data deve ser inserida.'),
  category: yup.string().required('A categoria deve ser inserida.'),
  description: yup.string().required('A Atividade deve ser inserida.'),
  cash: yup.number().required('insira um valor')
});