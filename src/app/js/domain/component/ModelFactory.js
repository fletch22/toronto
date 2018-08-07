import _ from 'lodash';
import f22Uuid from '../../../../common/util/f22Uuid';
import stateTraversal from '../../../../common/state/stateTraversal';

class ModelFactory {
  validateNotBlank(value, propertyName) {
    if (!!value === false
      || _.trim(value) === '') {
      throw new Error(`Encountered problem with property \'${propertyName}\'. Must have non-zeo-length value.`);
    }
  }

  ensureId(protoModel) {
    let id = protoModel.id;
    if (!id) {
      id = f22Uuid.generate();
    }
    return id;
  }

  getNextId(state) {
    return stateTraversal.getNextId(state);
  }
}

export default ModelFactory;

