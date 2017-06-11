import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DdlModelFactory extends ModelFactory {

  createInstance(parentId, name, dataSourceId) {
    const id = f22Uuid.generate();

    return {
      parentId,
      id,
      name,
      dataSourceId,
      typeLabel: ComponentTypes.DropDownListbox,
      style: null
    };
  }
}

export default new DdlModelFactory();
