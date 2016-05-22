import deepDiff from 'deep-diff';
import F22Uuid from '../util/f22Uuid';

class StatePackager {

  package(jsonStateOld, jsonStateNew) {
    const difference = deepDiff(JSON.parse(jsonStateOld).model, JSON.parse(jsonStateNew).model);

    // 'Package' is a reserved word and cannot be used.
    const packageTmp = {
      state: jsonStateNew,
      diffBetweenOldAndNew: JSON.stringify(difference),
      clientId: F22Uuid.generate()
    };

    return packageTmp;
  }
}

export default StatePackager;
