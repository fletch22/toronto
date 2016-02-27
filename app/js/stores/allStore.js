import { createStore } from 'redux';
import apps from '../reducers';
import sampleData from '../sampleData/appContainer';


// Transform native raw data response into react store data.

const allStore = createStore(apps, sampleData);

export default allStore;
