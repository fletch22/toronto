import express from 'express';
import c from './util/c';
import cors from 'cors';

const app = express();

app.use(cors());

const apiPath = '/api';

app.post(apiPath, (req, res) => {

  c('foo');

  res.send('{ "result": "success}" }');
});

export default app;
