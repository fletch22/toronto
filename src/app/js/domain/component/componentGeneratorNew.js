import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import datastoreModelFactory from './datastoreModelFactory';
import dataUniverseModelFactory from './dataUniverseModelFactory';
import DomFactory from './DomFactory';
import ComponentTypes from '../component/ComponentTypes';
import layoutModelFactory from './layoutModelFactory';
import layoutMinionModelFactory from './layoutMinionModelFactory';
import ddlModelFactory from './ddlModelFactory';
import buttonSubmitModelFactory from './buttonSubmitModelFactory';
import divModelFactory from './divModelFactory';
import dataModelFactory from './dataModelModelFactory';
import dataFieldModelFactory from './dataFieldModelFactory';


class ComponentGeneratorNew {

  createComponent(model) {
    switch (model.typeLabel) {
      case ComponentTypes.AppContainer: {
        return appContainerModelFactory.createInstance(model);
      }
      case ComponentTypes.DataUniverse: {
        return dataUniverseModelFactory.createInstance(model);
      }
      case ComponentTypes.Datastore: {
        return datastoreModelFactory.createInstance(model);
      }
      case ComponentTypes.App: {
        return appModelFactory.createInstance(model);
      }
      case ComponentTypes.Website: {
        return websiteModelFactory.createInstance(model);
      }
      case ComponentTypes.WebFolder: {
        return webFolderModelFactory.createInstance(model);
      }
      case ComponentTypes.WebPage: {
        return webPageModelFactory.createInstance(model);
      }
      case ComponentTypes.Div: {
        return divModelFactory.createInstanceFromModel(model);
      }
      case ComponentTypes.DropDownListbox: {
        return ddlModelFactory.createInstanceFromModel(model);
      }
      case ComponentTypes.ButtonSubmit: {
        return buttonSubmitModelFactory.createInstanceFromModel(model);
      }
      case ComponentTypes.DataModel: {
        return dataModelFactory.createInstanceFromModel(model);
      }
      case ComponentTypes.DataField: {
        return dataFieldModelFactory.createInstanceFromModel(model);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${model.typeLabel}\'`);
      }
    }
  }
}

export default new ComponentGeneratorNew();

