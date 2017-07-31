import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DivModelFactory extends ModelFactory {

  createInstance(parentId) {
    const id = f22Uuid.generate();

    return {
      parentId,
      id,
      typeLabel: ComponentTypes.Div,
      style: JSON.stringify({ boxShadow: 'inset 0px 0px 0px 1px gray', boxSizing: 'border-box', minWidth: '100px', minHeight: '100px' }),
      children: []
    };
  }
}

export default new DivModelFactory();
