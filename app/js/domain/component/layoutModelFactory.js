import ModelFactory from './ModelFactory';
import ComponentTypes from '../../domain/component/ComponentTypes';

class LayoutModelFactory extends ModelFactory {

  createInstance(parentId) {
    const id = this.ensureId({});

    const instance = {
      parentId,
      id,
      typeLabel: ComponentTypes.Layout,
      children: []
    };

    return instance;
  }
}

export default new LayoutModelFactory();
