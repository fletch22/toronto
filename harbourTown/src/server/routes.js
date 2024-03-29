import path from 'path';
import 'babel-core/register';
import { setUpUserRoutes } from './userRoutes.js';
import util from '../../../src/util/util';
import intialState from './config/initialState.json';

export const apiPath = '/api';

export const setUpRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.get(`${apiPath}/states/:index`, async (req, res) => {
    const response = {
      state: intialState
    };
    const optionalResponse = util.getOptionalLiteral(response);
    res.send(optionalResponse);
  });

  setUpUserRoutes(app);
};
