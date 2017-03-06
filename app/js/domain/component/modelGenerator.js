import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import layoutModelFactory from './layoutModelFactory';
import ComponentTypes from '../component/ComponentTypes';
import divModelFactory from '../component/divModelFactory';
import dataModelModelFactory from '../component/dataModelModelFactory';

class ModelGenerator {

  protoGenerate(parentId, childTypeLabel) {
    return {
      parentId,
      typeLabel: childTypeLabel
    };
  }

  generate(parentId, childTypeLabel) {
    let protoModel;
    switch (childTypeLabel) {
      case ComponentTypes.AppContainer: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return appContainerModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.App: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return appModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.Website: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return websiteModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.WebFolder: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return webFolderModelFactory.createWebFolder(protoModel);
      }
      case ComponentTypes.WebPage: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return webPageModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.Layout: {
        return layoutModelFactory.createInstance(parentId);
      }
      case ComponentTypes.Div: {
        return divModelFactory.createInstance(parentId);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${protoModel.typeLabel}\'`);
      }
    }
  }
}

export default new ModelGenerator();
