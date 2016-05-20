import React from 'react';
import CurrentStateRetriever from '../domain/stateRetriever';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import App from 'js/component/App';
import { Provider } from 'react-redux';
import defaultState from '../state/defaultState';
import { createStore } from 'redux';
import apps from '../reducers';
import DevTools from '../containers/DevTools';
import AllStore from '../stores/allStore';

class TestRenderedApp {

  setup(sandbox) {
    const state = Object.assign({}, defaultState.getInstance());
    state.model.appContainer.id = 123;
    //state.model.appContainer.children = [{ label: 'HelloWorldApp', id: 1040, parentId: 1039 }, { parentId: 1039, id: 1, label: 'asdf' }];

    return new Promise((resolve, reject) => {
      const currentStateRetriever = sandbox.stub(CurrentStateRetriever, 'getCurrent').returns(Promise.resolve(state));

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
          console.log(`Encountered exception: ${error.stack}`);
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