import path from 'path';
import 'babel-core/register';

export const apiPath = '/api';

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });
};

