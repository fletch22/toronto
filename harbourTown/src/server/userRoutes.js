import 'babel-core/register';
import entityService from './service/entityService';

export const apiPath = '/api';

export const setUpUserRoutes = (app) => {
  app.get(`${apiPath}/c1`, async (req, res) => {
    const collection = await entityService.getC1Collection();
    res.send(JSON.stringify(collection));
  });
};
