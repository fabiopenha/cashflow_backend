import 'dotenv/config';
import express from 'express';
import { DbConnect } from '../database/db';
import { userRoutes } from '../routes/UserRoute';

DbConnect();

const server = express();
server.use(express.json());
server.use(express.static('uploads'));
server.use(express.urlencoded({extended: true}));
server.use(userRoutes);



export { server };
