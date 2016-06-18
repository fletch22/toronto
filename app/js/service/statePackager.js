import deepDiff from 'deep-diff';
import F22Uuid from '../util/f22Uuid';

class StatePackager {

  package(jsonStateOld, jsonStateNew) {
    const stateNew = JSON.parse(jsonStateNew);
    const difference = deepDiff(JSON.parse(jsonStateOld).model, stateNew.model);

    // 'Package' is a reserved word and cannot be used.
    const packageTmp = {
      state: jsonStateNew,
      diffBetweenOldAndNew: JSON.stringify(difference),
      clientId: F22Uuid.generate(),
      serverStartupTimestamp: stateNew.serverStartupTimestamp
    };

    return packageTmp;
  }
}

export default StatePackager;
