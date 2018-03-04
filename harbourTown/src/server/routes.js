import path from 'path';
import 'babel-core/register';
import { setUpUserRoutes } from './userRoutes.js';
import util from '../../../src/util/util';

export const apiPath = '/api';

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.get(`${apiPath}/states/:index`, async (req, res) => {
    const state = {};
    const optionalResponse = util.getOptionalLiteral(state);
    res.send(JSON.stringify(optionalResponse));
  });

  setUpUserRoutes(app);
};
