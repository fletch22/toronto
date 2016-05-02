import deepDiff from 'deep-diff';

class StatePackager {

  package(jsonStateOld, jsonStateNew) {
    const difference = deepDiff(JSON.parse(jsonStateOld).model, JSON.parse(jsonStateNew).model);

    const package2 = {
      state: jsonStateNew,
      diffBetweenOldAndNew: JSON.stringify(difference)
    };

    return package2;
  }
}

export default StatePackager;