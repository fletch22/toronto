import ModelFactory from './ModelFactory';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DataUniverseModelFactory extends ModelFactory {

  createInstance(model) {
    this.validateNotBlank(model.label, 'label');

    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.DataUniverse,
      children: []
    };

    return instance;
  }
}

export default new DataUniverseModelFactory();
