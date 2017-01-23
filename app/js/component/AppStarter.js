import 'css/base';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoot from '../component/AppRoot';
import { Provider } from 'react-redux';
import 'css/modules/container';
import 'css/modules/toolbar';
import AllStore from '../stores/allStore';
import CrusoeModal from '../component/modals/CrusoeModal';
import dateformat from 'dateformat';

class AppStarter {

  constructor() {
    this.count = 0;
    this.maxRetry = 50;
    this.retryWaitMillis = 2000;
  }

  renderApp(store) {
    ReactDOM.render(
      <Provider store={store}>
        <AppRoot />
      </Provider>,
      document.querySelector('#main'));
  }

  start() {
    this.count++;

    if (this.count < this.maxRetry) {
      const allStore = new AllStore();
      const promiseInner = allStore.getStore();

      promiseInner.then((store) => {
        this.renderApp(store);
      }).catch((error) => {
        const dateFormatted = dateformat(new Date(), 'HH:MM.ss TT');
        const bodyText2 = `Last attempt: ${dateFormatted}.`;
        const bodyText3 = `Next retry: ${this.retryWaitMillis/1000} seconds.`;

        ReactDOM.render(
            <CrusoeModal showModal headerText="Render Error" bodyText1={error.stack} bodyText2={bodyText2} bodyText3={bodyText3} />,
          document.querySelector('#main'));

        console.error(error.stack);
        console.error(`Could not connect to back end. Will try again in ${this.retryWaitMillis}`);

        const promiseOnTimer = new Promise((resolve) => {
          window.setTimeout(resolve, this.retryWaitMillis);
        });

        promiseOnTimer.then(() => {
          this.start();
        });
      });
    } else {
      console.error('Tried to reach server. Giving up.');
    }
  }
}

export default AppStarter;
