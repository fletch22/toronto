import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';

class LayoutMinionFactory extends ModelFactory {

  createInstance(childId, parentId, key, typeLabel, height, width, x, y) {
    let id = childId;
    if (!id) {
      id = f22Uuid.generate();
    }

    const instance = {
      parentId,
      id,
      key,
      typeLabel,
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
