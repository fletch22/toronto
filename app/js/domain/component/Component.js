import _ from 'lodash';
import uuid from 'node-uuid';

class Component {

  wrapType(typeLabel, object) {
    object.typeLabel = typeLabel;
    return object;
  }

  validateNotNull(value, propertyName) {
    if (!!value === false
      || _.trim(value) === '') {
      throw new Error(`Encountered problem with property \'${propertyName}\'. Must have non-zeo-length value.`);
    }
  }

  ensureId(model) {
    let id = model.childId;
    if (!model.childId) {
      id = uuid.v1();
    }
    return id;
  }
}

export default Component;
