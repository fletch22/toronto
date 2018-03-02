import 'babel-core/register';
import 'babel-polyfill';
import cors from 'cors';

import bodyParser from 'body-parser';
import c from '../util/c';
import { setupNormalRoutes } from './routes';
import winston from 'winston';
import proxyDevServer from './service/proxyDevServer';

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

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const port = process.env.PORT || 3000;
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

// We only want to run the workflow when not in production
if (!isProduction && !isTest) {
  proxyDevServer.initialize(app);
}

const server = app.listen(port, () => {
  winston.info(`Server running on port ${port}`);
});

setupNormalRoutes(app);


module.exports = server;
