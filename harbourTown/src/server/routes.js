import path from 'path';
import winston from 'winston';
import 'babel-core/register';
import entityService from './service/entityService';

export const apiPath = '/api';

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.get('/c1', async (req, res) => {
    const collection = await entityService.getC1Collection();
    res.send(JSON.stringify(collection));
  });
};
