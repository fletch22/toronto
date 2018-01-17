import stateService from './service/stateService';
import sessionService from './service/sessionService';
import path from 'path';
import { responseSuccess } from './util/responseConstants';
import winston from 'winston';
import util from '../util/util';
import 'babel-core/register';

export const apiPath = '/api';

stateService.reindexLogFile().then(() => {
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
    stateService.persistStatePackage(req.body).then((result) => {
      res.send(result);
    });
  });

  app.get(`${apiPath}/sessions/mostRecentHistoricalFile`, (req, res) => {
    const result = stateService.findMostRecentHistoricalFile();
    res.send(JSON.stringify(result));
  });

  app.put(`${apiPath}/sessions/:sessionKey`, (req, res) => {
    winston.debug(`Called save session: ${req.params.sessionKey}`);
    sessionService.initializeSession(req.params.sessionKey).then(() => {
      winston.debug(`State Index length: ${stateService.stateIndex.length}`);
      res.send(responseSuccess);
    });
  });

  app.get(`${apiPath}/stateIndexes/:index`, async (req, res) => {
    winston.debug(`Getting index: ${req.params.index}`);
    const index = parseInt(req.params.index, 10);
    const result = await stateService.getStateByIndex(index);
    let stateAndMeta = null;
    if (result.isPresent()) {
      stateAndMeta = result.get();
    }
    res.send(JSON.stringify(util.getOptionalLiteral(stateAndMeta)));
  });

  app.post(`${apiPath}/states/:clientId`, async (req, res) => {
    winston.debug(`Getting stateId: ${req.params.clientId}`);
    const action = req.query.action;
    winston.debug(`post action: ${action}`);
    if (action === 'rollbackTo') {
      const clientId = req.params.clientId;
      const optionalState = await stateService.rollbackTo(clientId);
      res.send(JSON.stringify(util.convertOptionalForResponse(optionalState)));
    }
  });

  app.post(`${apiPath}/states`, async (req, res) => {
    winston.debug(`Getting stateId: ${req.params.clientId}`);
    winston.debug(`Getting action: ${req.query.action}`);
    const action = req.query.action;
    winston.info(`Post states action: ${action}`);
    switch (action) {
      case 'getMostRecentHistoricalState': {
        const optionalState = await stateService.findMostRecentStateInFile(req.body);
        res.send(JSON.stringify(optionalState));
        break;
      }
      case 'getEarliest': {
        const state = await stateService.findEarliestStateInFile(req.body);
        res.send(JSON.stringify(state));
        break;
      }
      case 'persistToDisk': {
        await stateService.persistToDisk();
        res.send(JSON.stringify({ result: 'Success' }));
        break;
      }
      case 'restoreFromDisk': {
        await stateService.restoreFromDisk();
        res.send(JSON.stringify({ result: 'Success' }));
        break;
      }
      case 'nukeAndPave': {
        stateService.nukeAndPave();
        res.send(JSON.stringify({ result: 'Success' }));
        break;
      }
      default: {
        throw new Error('Did not recognized action passed to POST state.');
      }
    }
  });
};

