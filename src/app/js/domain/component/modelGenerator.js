import appContainerModelFactory from './appContainerModelFactory';
import appModelFactory from './appModelFactory';
import websiteModelFactory from './websiteModelFactory';
import webFolderModelFactory from './webFolderModelFactory';
import webPageModelFactory from './webPageModelFactory';
import layoutModelFactory from './layoutModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import divModelFactory from '../component/divModelFactory';
import buttonSubmitModelFactory from '../component/buttonSubmitModelFactory';
import dataUniverseModelFactory from './dataUniverseModelFactory';
import dataNarrativeModelFactory from './dataNarrativeModelFactory';
import dnBrowserModelFactory from '../component/dataNarrative/dnBrowserModelFactory';
import dnConnectorOutNexusModelFactory from '../component/dataNarrative/dnConnectorOutNexusModelFactory';
import dnConnectorModelFactory from '../component/dataNarrative/dnConnectorModelFactory';
import dnTransferCaseModelFactory from '../component/dataNarrative/dnTransferCaseModelFactory';
import ddlModelFactory from 'app/js/domain/component/ddlModelFactory';


class ModelGenerator {

  protoGenerate(parentId, childTypeLabel) {
    return {
      parentId,
      typeLabel: childTypeLabel
    };
  }

  generate(state, parentId, childTypeLabel) {
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
      case ComponentTypes.DropDownListbox: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return ddlModelFactory.createInstanceFromModel(protoModel);
      }
      case ComponentTypes.DataUniverse: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        protoModel.label = 'default';
        return dataUniverseModelFactory.createInstance(protoModel);
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
        protoModel.pageName = 'defaultPageName';
        return webPageModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.Layout: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return layoutModelFactory.createInstanceFromModel(protoModel);
      }
      case ComponentTypes.Div: {
        return divModelFactory.createInstance(parentId);
      }
      case ComponentTypes.ButtonSubmit: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return buttonSubmitModelFactory.createInstanceFromModel(protoModel);
      }
      case ComponentTypes.DataNarrative: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return dataNarrativeModelFactory.createInstance(protoModel);
      }
      case ComponentTypes.DnBrowser: {
        return dnBrowserModelFactory.createInstance(state, parentId, []);
      }
      case ComponentTypes.DnConnectorOutNexus: {
        return dnConnectorOutNexusModelFactory.createInstance(state, parentId, 0, 0);
      }
      case ComponentTypes.DnConnector: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return dnConnectorModelFactory.createInstance(state, parentId, null, []);
      }
      case ComponentTypes.DnTransferCase: {
        protoModel = this.protoGenerate(parentId, childTypeLabel);
        return dnTransferCaseModelFactory.createInstance(state, parentId, []);
      }
      default: {
        throw new Error(`Could not determine component type from model's type label \'${protoModel.typeLabel}\'`);
      }
    }
  }
}

export default new ModelGenerator();
