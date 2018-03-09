import 'babel-core/register';
import entityService from './service/entityService';

export const apiPath = '/api';

export const setUpUserRoutes = (app) => {
  app.get(`${apiPath}/options/c1OptionData`, async (req, res) => {
    const collection = await entityService.getC1OptionDataCollection();
    res.send(JSON.stringify(collection));
  });
};
