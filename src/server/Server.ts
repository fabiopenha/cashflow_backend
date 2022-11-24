import express from 'express';
import 'dotenv/config';

import { DbConnect } from '../models/db';

DbConnect();

const server = express();

interface Ititle {
	
}

server.get('/', (req, res) => {
  return res.send('It\'s working!');
});

export { server };