import path from 'path';
import winston from 'winston';
import 'babel-core/register';

export const apiPath = '/api';

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.get('/c1', (req, res) => {
    res.send(JSON.stringify({ foo: 'bar' }));
  });
};
