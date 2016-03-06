import { createStore } from 'redux';
import apps from '../reducers';
import AppModel from '../sampleData/AppModel';
import ModelToStateTransformer from './modelToStateTransformer';
import DevTools from '../containers/DevTools';
// Transform native raw data response into react store data.
const state = ModelToStateTransformer.transform(AppModel);

const allStore = createStore(apps, state, DevTools.instrument());

export default allStore;
