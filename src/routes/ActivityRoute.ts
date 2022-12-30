import { Router } from 'express';
import { activityValidator } from '../utils/activityValidator';
import { ActivityController } from './../controllers/activityController';
import { ActivityValidate } from '../Middlewares/validationActivityMiddleware';

const route = Router();

route.post(
  '/v1/activity/create/:id',
  ActivityValidate(activityValidator),
  ActivityController.CreateActivity
);

route.get(
  '/v1/activity/getuseractivities/:id',
  ActivityController.GetActivitiesByUser
);
  
route.get(
  '/v1/activity/getactivitiesdata/:id',
  ActivityController.GetActibityDataByUser
);
  
route.post(
  '/v1/auth/authenticator',
  //UserController.Authenticator
);
  
export const activityRoutes = route;
  