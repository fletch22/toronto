import _ from 'lodash';
import f22Uuid from '../../../../common/util/f22Uuid';

class ModelViewFactory {

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
}

export default ModelViewFactory;
