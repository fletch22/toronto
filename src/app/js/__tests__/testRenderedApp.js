import React from 'react';
import CurrentStateRetriever from '../domain/stateRetriever';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import App from 'app/js/component/AppRoot';
import { Provider } from 'react-redux';
import defaultState from '../state/defaultState';
import AllStore from '../stores/allStore';

class TestRenderedApp {

  setup(sandbox) {
    const stateFromServer = Object.assign({}, defaultState.getInstance());

    return new Promise((resolve, reject) => {
      const currentStateRetriever = sandbox.stub(CurrentStateRetriever, 'getCurrent').returns(Promise.resolve(stateFromServer));

      const allStore = new AllStore();
      const promise = allStore.getStore();

      promise.then((store) => {
        try {
          expect(currentStateRetriever.called).to.equal(true);

          const renderedComponent = TestUtils.renderIntoDocument(
            <Provider store={store}>
              <App />
            </Provider>,
            document.querySelector('#main')
          );

          resolve({
            store,
            renderedComponent
          });
        } catch (error) {
          console.error(error.message);
          console.error(`Encountered exception: ${error.stack}`);
        }
      });

      promise.catch((error) => {
        reject(error);
      });

      return promise;
    });
  }
}

export default TestRenderedApp;
