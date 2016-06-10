import jQuery from 'jquery';
import 'css/base';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'js/component/App';
import { Provider } from 'react-redux';
import 'css/modules/container';
import 'css/modules/toolbar';

global.jQuery = jQuery;

import AllStore from 'js/stores/allStore';
const allStore = new AllStore();

let count = 0;
const maxRetry = 10;

function renderApp(store) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#main'));
}

function getStore() {
  count++;

  if (count < maxRetry) {
    const promiseInner = allStore.getStore();

    promiseInner.then((store) => {
      console.log("Rendering app.");
      renderApp(store);
    }).catch(getStore);
  } else {
    console.log("Tried to reach server. Giving up.");
  }
}

getStore();




