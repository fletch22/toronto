import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DdlModelFactory extends ModelFactory {

  createInstance(parentId, name, dataStoreId, dataModelId, dataValueId, dataTextId) {
    const id = f22Uuid.generate();

    let dataStoreIdNumber = null;
    if (dataStoreId) {
      dataStoreIdNumber = parseInt(dataStoreId, 10);
    }

    return {
      parentId,
      id,
      name,
      dataStoreId: dataStoreIdNumber,
      dataModelId,
      dataValueId,
      dataTextId,
      typeLabel: ComponentTypes.DropDownListbox,
      style: null
    };
  }
}

export default new DdlModelFactory();
