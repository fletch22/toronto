import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DivModelFactory extends ModelFactory {

  createInstance(model) {
    const id = f22Uuid.generate();

    return {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.Div,
      style: JSON.stringify({ boxShadow: 'inset 0px 0px 0px 1px gray', boxSizing: 'border-box', minWidth: '100px', minHeight: '100px' }),
      children: [],
      ordinal: model.ordinal
    };
  }

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    const instance = {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.Div,
      style: model.style,
      children: [],
      ordinal: model.ordinal
    };

    return instance;
  }
}

export default new DivModelFactory();
