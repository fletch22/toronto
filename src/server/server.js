import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { persistState } from './service/persistToDiskService';
import c from '../util/c';

global.c = c;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiPath = '/api';

app.post(apiPath, (req, res) => {
  persistState(req.body);

  res.send('{ "result": "success}" }');
});

export default app;
