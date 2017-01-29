import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class LayoutMinionFactory extends ModelFactory {

  createInstance(parentId, key, height, width, x, y) {
    const id = f22Uuid.generate();

    const instance = {
      parentId,
      id,
      key,
      typeLabel: ComponentTypes.LayoutMinion,
      height,
      width,
      x,
      y,
      children: []
    };

    return instance;
  }
}

export default new LayoutMinionFactory();
