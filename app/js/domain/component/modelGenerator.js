import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import ComponentTypes from '../component/ComponentTypes';

class ModelGenerator {

  protoGenerate(parentId, childTypeLabel) {
    return {
      parentId,
      typeLabel: childTypeLabel
    };
  }

  generate(parentId, childTypeLabel) {
    const protoModel = this.protoGenerate(parentId, childTypeLabel);
    switch (protoModel.typeLabel) {
      case ComponentTypes.AppContainer: {
        return appContainerModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.App: {
        return appModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.Website: {
        return websiteModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.WebFolder: {
        return webFolderModelFactory.createWebFolder(protoModel);
      }
      case ComponentTypes.WebPage: {
        return webPageModelFactory.createInstance(protoModel);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${protoModel.typeLabel}\'`);
      }
    }
  }
}

export default new ModelGenerator();
