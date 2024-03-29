import _ from 'lodash';
import PseudoModalTypes from '../component/modals/PseudoModalTypes';
import EditorNames from '../component/editors/EditorNames';
import graphTraversal from '../../../common/state/graphTraversal';
import f22Uuid from '../../../common/util/f22Uuid';
import viewModelFactory from './viewModelFactory';

class ActionPseudoModalEditorCreator {

  constructor() {
    this.WEB_PAGE_ROOT = 'WEB_PAGE_ROOT';
  }

  createFromAction(state, action) {
    const payload = action.payload;

    return this.create(state, payload.options, payload.componentType);
  }

  create(state, options, type) {
    let viewName;
    let viewModel;

    const optionsClone = _.cloneDeep(options);
    const modelNodeId = optionsClone.modelNodeId;
    let model;
    if (modelNodeId) {
      model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));
    } else {
      model = { parentId: options.parentModelId, typeLabel: type };
    }

    if (!model.children) model.children = [];

    let title = '';
    let className = '';
    switch (type) {
      case PseudoModalTypes.ComponentTypes.Website: {
        viewName = EditorNames.EDIT_WEBSITE_DETAILS;
        title = 'Edit Website';
        className = 'pseudo-modal-edit-website';
        break;
      }
      case PseudoModalTypes.ComponentTypes.WebFolder: {
        viewName = EditorNames.EDIT_WEBSITE_FOLDER_DETAILS;
        title = 'Edit Website Folder';
        className = 'pseudo-modal-edit-website-folder';
        break;
      }
      case PseudoModalTypes.ComponentTypes.WebPage: {
        viewName = EditorNames.EDIT_WEBSITE_PAGE_DETAILS;
        title = 'Edit Website Page';
        viewModel = viewModelFactory.generateViewModel(this.WEB_PAGE_ROOT, model);
        className = 'pseudo-modal-edit-website-page';
        break;
      }
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        title = 'Edit Select';
        viewName = EditorNames.Wizards.ConfigureDdl;
        className = 'pseudo-modal-edit-configureddl';
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    const data = Object.assign({}, optionsClone, { id: f22Uuid.generate() }, { model }, { viewModel });

    return {
      viewName,
      data,
      title,
      className
    };
  }
}

export default new ActionPseudoModalEditorCreator();
