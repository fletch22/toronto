import stateService from './stateService';
import ComponentTypes from '../../common/domain/component/ComponentTypes';

class UserDataService {
  getDataCollection(id) {
    const optionalState = stateService.findMostRecentStateInFile();

    if (!optionalState.isPresent()) {
      throw new Error('Encountered problem trying to get state while trying to get DataCollection. State not found.')
    }

    const state = optionalState.get();

    const dataStore = this.getDefaultDataStore(state);

    // NOTE: 2017:01-27: In the future, this will get streaming data services and external services as well;
    const dataModel = this.getDataModelBy('id', id, dataStore);
  }

  getDataUniverse(state) {
    return state.model.appContainer.children.find((child) => (child.typeLabel === ComponentTypes.DataUniverse));
  }

  getDefaultDataStore(state) {
    return this.getDataStoreBy('label', 'default', state);
  }

  getDataStoreBy(by, value, state) {
    const dataUniverse = this.getDataUniverse(state);

    return !!dataUniverse.children && dataUniverse.children.find((child) => child.typeLabel === ComponentTypes.Datastore && !!child[by] && child[by] === value);
  }

  getDataModelBy(propertyName, propertyValue, dataStore) {
    let result;
    if (!!dataStore &&
    dataStore.children) {
      result = dataStore.children.find((child) => child[propertyName] === propertyValue);
    }
    return result;
  }
}

export default new UserDataService();
