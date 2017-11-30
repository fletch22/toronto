import persistStateToDiskService from './service/persistStateToDiskService';
import persistSessionService from './service/persistSessionService';
import path from 'path';

export const apiPath = '/api';

export const setupDevelopmentBuildRoutes = (app) => {
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer();

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  const bundle = require('./bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8081'
    });
  });

  // It is important to catch any errors from the proxy or the
  // server will crash. An example of this is connecting to the
  // server when webpack is bundling
  proxy.on('error', (e) => {
    console.log('Could not connect to proxy, please try again...');
  });
};

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.post(apiPath, (req, res) => {
    persistStateToDiskService.persistState(req.body).then(() => {
      c.l('test');
      res.send('{ "result": "success" }');
    });
  });

  app.get(`${apiPath}/sessions/mostRecentHistorical`, (req, res) => {
    persistStateToDiskService.findMostRecentHistoricalFile().then(() => {
      res.send('{ "result": "not yet implemented." }');
    });
  });

  app.post(`${apiPath}/sessions/:sessionKey`, (req, res) => {
    persistSessionService.ensureSessionPersisted(req.params.sessionKey).then(() => {
      res.send('{ "result": "success" }');
    });
  });
};
