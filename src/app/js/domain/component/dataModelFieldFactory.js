import ModelFactory from './ModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import f22Uuid from '../../../../common/util/f22Uuid';

class DataModelModelFactory extends ModelFactory {

  createInstance(parentId, label) {
    this.validateNotBlank(label, 'label');

    const id = f22Uuid.generate();

    const instance = {
      parentId,
      id,
      label,
      typeLabel: ComponentTypes.DataField,
      children: []
    };

    return instance;
  }
}

export default new DataModelModelFactory();
