import ModelFactory from './ModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';



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
