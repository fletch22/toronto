import deepDiff from 'deep-diff';
import uuid from 'node-uuid';

class StatePackager {

  package(jsonStateOld, jsonStateNew) {
    const difference = deepDiff(JSON.parse(jsonStateOld).model, JSON.parse(jsonStateNew).model);

    const package2 = {
      state: jsonStateNew,
      diffBetweenOldAndNew: JSON.stringify(difference),
      clientId: uuid.v1()
    };

    return package2;
  }
}

export default StatePackager;