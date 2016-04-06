import { createStore } from 'redux';
import apps from '../reducers';

import ModelToStateTransformer from './modelToStateTransformer';
import DevTools from '../containers/DevTools';
import RestService from '../service/restService';

const AllStore = new Promise((resolve, reject) => {
  RestService.getAppContainer()
  .then((data) => {
    const state = ModelToStateTransformer.transform(data);
    const store = createStore(apps, state, DevTools.instrument());
    resolve(store);
  })
  .catch((error) => {
    reject(error);
  });
});

export default AllStore;

