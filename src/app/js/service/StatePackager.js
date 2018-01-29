import deepDiff from 'deep-diff';
import F22Uuid from '../../../common/util/f22Uuid';

class StatePackager {

  package(jsonStateOld, jsonStateNew) {
    const stateNew = JSON.parse(jsonStateNew);

    // 'Package' is a reserved word and cannot be used.
    const packageTmp = {
      state: jsonStateNew,
      clientId: F22Uuid.generate(),
      serverStartupTimestamp: stateNew.serverStartupTimestamp
    };

    return packageTmp;
  }
}

export default StatePackager;
