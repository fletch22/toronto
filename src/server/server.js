import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import persistStateToDiskService from './service/persistStateToDiskService';
import c from '../util/c';

global.c = c;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiPath = '/api';

app.post(apiPath, (req, res) => {
  persistStateToDiskService.persistState(req.body).then(() => {
    res.send('{ "result": "success" }');
  });
});

app.get(`${apiPath}/sessions/mostRecentHistorical`, (req, res) => {
  persistStateToDiskService.findMostRecentHistoricalState().then(() => {
    res.send('{ "result": "not yet implemented." }');
  });
});

export default app;
