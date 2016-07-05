import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers/index';
import DevTools from '../containers/DevTools';
import currentStateRetriever from '../domain/stateRetriever';
import thunk from 'redux-thunk';

class AllStore {

  getStore() {
    return new Promise((resolve, reject) => {
      const promise = currentStateRetriever.getCurrent();

      promise.then((state) => {
        const store = applyMiddleware(thunk)(createStore)(reducer, state, DevTools.instrument());
        resolve(store);
      })
      .catch((error) => {
        reject(error);
      });

      return promise;
    });
  }
}

export default AllStore;

