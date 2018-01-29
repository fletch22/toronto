import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import datastoreModelFactory from './datastoreModelFactory';
import dataUniverseModelFactory from './dataUniverseModelFactory';
import DomFactory from './DomFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import layoutModelFactory from './layoutModelFactory';
import layoutMinionModelFactory from './layoutMinionModelFactory';
import ddlModelFactory from './ddlModelFactory';
import buttonSubmitModelFactory from './buttonSubmitModelFactory';
import divModelFactory from './divModelFactory';
import dataModelFactory from './dataModelModelFactory';
import dataFieldModelFactory from './dataFieldModelFactory';


class ComponentGeneratorDeprecated {

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

  createDataUniverse(model) {
    const modelChild = dataUniverseModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createDatastore(model) {
    const modelChild = datastoreModelFactory.createInstance(model);
    return {
      model: modelChild,
      dom: null
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

  createLayout(model) {
    const modelChild = layoutModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createLayoutMinion(model) {
    const modelChild = layoutMinionModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createDiv(model) {
    const modelChild = divModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createDropDownListbox(model) {
    const modelChild = ddlModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createButtonSubmit(model) {
    const modelChild = buttonSubmitModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  // createDataModel
  createDataModelModel(model) {
    const modelChild = dataModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createDataFieldModel(model) {
    const modelChild = dataFieldModelFactory.createInstanceFromModel(model);
    return {
      model: modelChild,
      dom: null
    };
  }

  createComponent(model) {
    switch (model.typeLabel) {
      case ComponentTypes.AppContainer: {
        return this.createAppContainer(model);
      }
      case ComponentTypes.DataUniverse: {
        return this.createDataUniverse(model);
      }
      case ComponentTypes.Datastore: {
        return this.createDatastore(model);
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
      case ComponentTypes.Div: {
        return this.createDiv(model);
      }
      case ComponentTypes.DropDownListbox: {
        return this.createDropDownListbox(model);
      }
      case ComponentTypes.ButtonSubmit: {
        return this.createButtonSubmit(model);
      }
      case ComponentTypes.DataModel: {
        return this.createDataModelModel(model);
      }
      case ComponentTypes.DataField: {
        return this.createDataFieldModel(model);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${model.typeLabel}\'`);
      }
    }
  }
}

export default new ComponentGeneratorDeprecated();

