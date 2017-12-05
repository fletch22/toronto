import stateService from './service/stateService';
import persistSessionService from './service/persistSessionService';
import path from 'path';
import { responseSuccess } from './util/responseConstants';
import c from '../util/c';

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

  app.post(`${apiPath}/stateArrays/`, (req, res) => {
    stateService.persistStateArrays(req.body).then(() => {
      res.send(responseSuccess);
    });
  });

  app.post(`${apiPath}/statePackages/`, (req, res) => {
    stateService.persistStatePackage(req.body).then(() => {
      res.send(responseSuccess);
    });
  });

  app.get(`${apiPath}/states/mostRecentHistoricalState`, (req, res) => {
    stateService.findMostRecentStateInFile(req.body).then((optionalState) => {
      res.send(JSON.stringify(optionalState));
    });
  });

  app.get(`${apiPath}/sessions/mostRecentHistoricalFile`, (req, res) => {
    const result = stateService.findMostRecentHistoricalFile();

    res.send(JSON.stringify(result));
  });

  app.put(`${apiPath}/sessions/:sessionKey`, (req, res) => {
    c.l(`Called save session: ${req.params.sessionKey}`);
    persistSessionService.ensureSessionPersisted(req.params.sessionKey).then(() => {
      res.send(responseSuccess);
    });
  });

  app.get(`${apiPath}/stateIndexes/:index`, (req, res) => {
    c.l(`Getting index: ${req.params.index}`);
    stateService.getStateByIndex(req.params.index).then((result) => {
      res.send(JSON.stringify(result));
    });
  });
};
