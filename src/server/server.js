import express from 'express';
import c from '../util/c';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiPath = '/api';

app.post(apiPath, (req, res) => {

  c.lo(req.body);

  res.send('{ "result": "success}" }');
});

export default app;
