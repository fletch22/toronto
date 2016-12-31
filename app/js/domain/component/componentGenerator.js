import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import domFactory from './domFactory';
import ComponentTypes from '../component/ComponentTypes';

class ComponentGenerator {

  createApp(parentId, childLabel, childId) {
    const modelChild = appModelFactory.createInstance(parentId, childLabel, childId);
    return {
      model: modelChild,
      dom: domFactory.createApp(modelChild)
    };
  }

  createWebsite(model) {
    const modelChild = websiteModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: domFactory.createWebsite(modelChild)
    };
  }

  createWebFolder(model) {
    const modelChild = webFolderModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: domFactory.createWebFolder(modelChild)
    };
  }

  createWebPage(model) {
    const modelChild = webPageModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: domFactory.createWebPage(modelChild)
    };
  }

  createComponent(model) {
    switch (model.typeLabel) {
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
      default: {
        throw new Error(`Could not determine component type from model's type label \'${model.typeLabel}\'`);
      }
    }
  }
}

export default new ComponentGenerator();
