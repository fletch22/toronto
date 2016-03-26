import jQuery from 'jquery';
import 'css/base';

import React from 'react';
import ReactDOM from 'react-dom';

import App from 'js/component/App';
import { Provider } from 'react-redux';

import 'css/modules/container';
import 'css/modules/toolbar';
import allStore from 'js/stores/allStore';

global.jQuery = jQuery;

allStore.then((store) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#main'));
});

const Worker = require('worker!./js/worker/statePersisterWorker.js');
const worker = new Worker();
worker.onmessage = function (event) {
  console.log(`This was an event reflection from the worker thread: ${event.data}`);
};



