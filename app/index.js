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
const promise = allStore.getStore();

promise.then((store) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#main'));
});




