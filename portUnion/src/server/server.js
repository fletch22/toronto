import cors from 'cors';

import bodyParser from 'body-parser';
import c from '../util/c';
import { setupNormalRoutes } from './routes';
import winston from 'winston';

global.c = c;

import exitHook from 'exit-hook';
exitHook(() => {
  winston.info('exiting');
});

const express = require('express');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

const server = app.listen(port, () => {
  winston.info(`Server running on port ${port}`);
});

setupNormalRoutes(app);


module.exports = server;
