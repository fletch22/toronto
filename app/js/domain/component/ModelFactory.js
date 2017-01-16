import _ from 'lodash';
import uuid from 'node-uuid';

class ModelViewFactory {

  wrapType(typeLabel, object) {
    object.typeLabel = typeLabel;
    return object;
  }

  validateNotBlank(value, propertyName) {
    if (!!value === false
      || _.trim(value) === '') {
      throw new Error(`Encountered problem with property \'${propertyName}\'. Must have non-zeo-length value.`);
    }
  }

  ensureId(protoModel) {
    let id = protoModel.id;
    if (!id) {
      id = uuid.v1();
    }
    return id;
  }
}

export default ModelViewFactory;
