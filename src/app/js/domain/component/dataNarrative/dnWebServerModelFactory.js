import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnWebServerModelFactory extends ModelFactory {
  createInstance(parentId, dataStoreId) {
    return svgModelFactoryHelper.mergeSvgAttributes({
      id: f22Uuid.generate(),
      parentId,
      dataStoreId,
      typeLabel: ComponentTypes.DnWebServer,
      children: []
    });
  }
}

export default new DnWebServerModelFactory();

