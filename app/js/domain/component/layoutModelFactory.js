import ModelFactory from './ModelFactory';
import ComponentTypes from '../../domain/component/ComponentTypes';

class LayoutModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.Layout,
      children: []
    };

    return instance;
  }
}

export default new LayoutModelFactory();
