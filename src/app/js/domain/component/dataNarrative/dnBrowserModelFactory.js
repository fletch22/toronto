import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';
import referenceUtils from 'app/js/util/referenceUtils';

class DnBrowserModelFactory extends ModelFactory {
  createInstance(state, parentId, webPageModel) {
    const id = this.getNextId(state);

    const browserModelRaw = {
      id,
      parentId,
      typeLabel: ComponentTypes.DnBrowser,
      children: [this.createConnectorOut(state, id, 100, 39)]
    };

    referenceUtils.createReference(state, browserModelRaw, 'dataSource', webPageModel.id, `depends on ${webPageModel.typeLabel} '${webPageModel.id}'`);

    return svgModelFactoryHelper.mergeSvgAttributes(browserModelRaw);
  }

  createConnectorOut(state, parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(state, parentId, offsetX, offsetY, 0);
  }
}

export default new DnBrowserModelFactory();

