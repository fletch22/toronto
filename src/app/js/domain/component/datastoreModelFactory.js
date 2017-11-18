import ModelFactory from './ModelFactory';
import ComponentTypes from '../../domain/component/ComponentTypes';

export const DatastoreModelConstants = {
  DEFAULT_DATASTORE_LABEL: 'default'
};

class DatastoreModelFactory extends ModelFactory {

  createInstance(model) {
    this.validateNotBlank(model.label, 'label');

    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      label: model.label,
      typeLabel: ComponentTypes.Datastore,
      children: []
    };

    return instance;
  }
}

export default new DatastoreModelFactory();
