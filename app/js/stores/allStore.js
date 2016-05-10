import { createStore, applyMiddleware } from 'redux';
import apps from '../reducers';
import DevTools from '../containers/DevTools';
import currentStateRetriever from '../domain/stateRetriever';
import thunk from 'redux-thunk';

class AllStore {

  getStore() {
    return new Promise((resolve) => {

      const promise = currentStateRetriever.getCurrent();

      promise.then((state) => {
        const store = applyMiddleware(thunk)(createStore)(apps, state, DevTools.instrument());
        resolve(store);
      });

      return promise;
    });
  }
}

export default AllStore;

