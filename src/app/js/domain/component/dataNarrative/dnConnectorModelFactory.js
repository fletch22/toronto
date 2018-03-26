import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnConnectorModelFactory extends ModelFactory {
  createInstance(model) {
    const id = this.ensureId(model);

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId: model.parentId,
      typeLabel: ComponentTypes.DnConnector,
      viewCoordinates: model.viewCoordinates,
      children: []
    });
  }
}

export default new DnConnectorModelFactory();

