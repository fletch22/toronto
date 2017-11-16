import ModelFactory from './ModelFactory';
import ComponentTypes from '../../domain/component/ComponentTypes';
import f22Uuid from '../../util/f22Uuid';

class DataFieldModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.DataField,
      children: []
    };

    return instance;
  }
}

export default new DataFieldModelFactory();

