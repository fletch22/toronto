import express from 'express';
import c from './util/c';
const app = express();


const apiPath = '/api';

app.post(apiPath, (req, res) => {

  c('foo');

  res.send();
});

export default app;
