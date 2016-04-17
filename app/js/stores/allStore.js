import { createStore } from 'redux';
import apps from '../reducers';
import DevTools from '../containers/DevTools';
import currentStateRetriever from '../domain/stateRetriever';

//const AllStore = new Promise((resolve) => {
//
//  const promise = currentStateRetriever.getCurrent();
//
//  promise.then((state) => {
//    const store = createStore(apps, state, DevTools.instrument());
//    resolve(store);
//  });
//});

class AllStore {

  getStore() {
    return new Promise((resolve) => {

      const promise = currentStateRetriever.getCurrent();

      promise.then((state) => {
        const store = createStore(apps, state, DevTools.instrument());
        resolve(store);
      });

      return promise;
    });
  }
}

export default AllStore;

