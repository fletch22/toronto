import ModelFactory from './ModelFactory';
import f22Uuid from '../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

class LayoutMinionFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      key: model.key,
      typeLabel: ComponentTypes.LayoutMinion,
      height: model.height,
      width: model.width,
      x: model.x,
      y: model.y,
      style: model.style,
      children: []
    };

    return instance;
  }

  createProtoInstance(parentId, key, height, width, x, y, style)  {
    return { parentId, key, height, width, x, y, style };
  }

  createInstance(parentId, key, height, width, x, y, style) {
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
      style,
      children: []
    };

    return instance;
  }
}

export default new LayoutMinionFactory();
