import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { DbConnect } from '../database/db';
import { userRoutes } from '../routes/UserRoute';
import { activityRoutes } from '../routes/ActivityRoute';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import cors from 'cors';

DbConnect();

const server = express();
server.use(express.json());
server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://thecashflow.onrender.com',
    ],
    credentials: true
  })
);

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.get('/swagger', (request, response) => {
  return response.sendFile(process.cwd() + '/src/swagger.json');
});

server.get('/docs', (request, response) => {
  return response.sendFile(process.cwd() + '/index.html');
});

server.use(cookieParser());
server.use(express.static('uploads'));
server.use(express.urlencoded({extended: true}));
server.use(userRoutes);
server.use(activityRoutes);



export { server };
