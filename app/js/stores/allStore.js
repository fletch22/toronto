import { createStore } from 'redux';
import apps from '../reducers';

import ModelToStateTransformer from './modelToStateTransformer';
import DevTools from '../containers/DevTools';
import RestService from '../service/restService';
import jQuery from 'jquery';

const promise = RestService.getAppContainer();
const AllStore = jQuery.Deferred();

promise.then((data) => {
  const state = ModelToStateTransformer.transform(data);
  const store = createStore(apps, state, DevTools.instrument());
  AllStore.resolve(store);
});

export default AllStore;

