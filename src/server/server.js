import cors from 'cors';

import bodyParser from 'body-parser';
import persistStateToDiskService from './service/persistStateToDiskService';
import c from '../util/c';

global.c = c;

const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

// We only want to run the workflow when not in production
if (!isProduction) {
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
}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', (e) => {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
});

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
