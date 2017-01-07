import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import layoutDivModelFactory from './layoutDivModelFactory';
import DomFactory from './DomFactory';
import ComponentTypes from '../component/ComponentTypes';

class ComponentGenerator {

  createAppContainer(model) {
    const modelChild = appContainerModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createAppContainer(modelChild)
    };
  }

  createApp(model) {
    const modelChild = appModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createApp(modelChild)
    };
  }

  createWebsite(model) {
    const modelChild = websiteModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createWebsite(modelChild)
    };
  }

  createWebFolder(model) {
    const modelChild = webFolderModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createWebFolder(modelChild)
    };
  }

  createWebPage(model) {
    const modelChild = webPageModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createWebPage(modelChild)
    };
  }

  createLayoutDiv(model) {
    const modelChild = layoutDivModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: DomFactory.createLayoutDiv(modelChild)
    };
  }

  createComponent(model) {

    switch (model.typeLabel) {
      case ComponentTypes.AppContainer: {
        return this.createAppContainer(model);
      }
      case ComponentTypes.App: {
        return this.createApp(model);
      }
      case ComponentTypes.Website: {
        return this.createWebsite(model);
      }
      case ComponentTypes.WebFolder: {
        return this.createWebFolder(model);
      }
      case ComponentTypes.WebPage: {
        return this.createWebPage(model);
      }
      case ComponentTypes.LayoutDiv: {
        return this.createLayoutDiv(model);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${model.typeLabel}\'`);
      }
    }
  }
}

export default new ComponentGenerator();
