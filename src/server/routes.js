import stateService from './service/stateService';
import sessionService from './service/sessionService';
import path from 'path';
import { responseSuccess } from './util/responseConstants';
import winston from 'winston';
import util from '../util/util';
import 'babel-core/register';
import 'babel-polyfill';

export const apiPath = '/api';

stateService.reindexLogFile().then((result) => {
  winston.info('Finished reindexing log file.');
});

export const setupNormalRoutes = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
  });

  app.post(`${apiPath}/stateArrays/`, async (req, res) => {
    await stateService.persistStateArrays(req.body);
    res.send(responseSuccess);
  });

  app.post(`${apiPath}/statePackages/`, (req, res) => {
    stateService.persistStatePackage(req.body).then(() => {
      res.send(responseSuccess);
    });
  });

  app.get(`${apiPath}/sessions/mostRecentHistoricalFile`, (req, res) => {
    const result = stateService.findMostRecentHistoricalFile();

    res.send(JSON.stringify(result));
  });

  app.put(`${apiPath}/sessions/:sessionKey`, (req, res) => {
    winston.info(`Called save session: ${req.params.sessionKey}`);
    sessionService.initializeSession(req.params.sessionKey).then(() => {
      res.send(responseSuccess);
    });
  });

  app.get(`${apiPath}/stateIndexes/:index`, async (req, res) => {
    winston.info(`Getting index: ${req.params.index}`);
    const index = parseInt(req.params.index, 10);
    const result = await stateService.getStateByIndex(index, 10);
    let state = null;
    if (result.isPresent()) {
      state = result.get();
    }
    res.send(JSON.stringify(util.getOptionalLiteral(state)));
  });

  app.post(`${apiPath}/states/:clientId`, async (req, res) => {
    winston.info(`Getting stateId: ${req.params.clientId}`);
    winston.info(`Getting action: ${req.query.action}`);
    const action = req.query.action;
    winston.info(`action: ${action}`);
    if (action === 'rollbackTo') {
      const clientId = req.params.clientId;
      const optionalState = await stateService.getStateByClientId(clientId);
      res.send(JSON.stringify(util.convertOptionalForResponse(optionalState)));
    }
  });

  app.post(`${apiPath}/states`, async (req, res) => {
    winston.info(`Getting stateId: ${req.params.clientId}`);
    winston.info(`Getting action: ${req.query.action}`);
    const action = req.query.action;
    winston.info(`action: ${action}`);
    if (action === 'getMostRecentHistoricalState') {
      const optionalState = await stateService.findMostRecentStateInFile(req.body);
      res.send(JSON.stringify(optionalState));
    }
  });
};

