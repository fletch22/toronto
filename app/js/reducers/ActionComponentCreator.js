import _ from 'lodash';
import ComponentTypes from '../domain/component/ComponentTypes';
import EditorNames from '../component/editors/EditorNames';
import graphTraversal from '../state/graphTraversal';
import f22Uuid from '../util/f22Uuid';
import viewFactory from '../domain/component/view/viewFactory';
import modelGenerator from '../../js/domain/component/modelGenerator';

class ActionComponentCreator {
  createComponentEditorData(state, action) {
    const type = action.payload.componentType;
    let componentViewName;
    let viewModel;
    switch (type) {
      case ComponentTypes.Website: {
        componentViewName = EditorNames.EDIT_WEBSITE_DETAILS;
        break;
      }
      case ComponentTypes.WebFolder: {
        componentViewName = EditorNames.EDIT_WEBSITE_FOLDER_DETAILS;
        break;
      }
      case ComponentTypes.WebPage: {
        componentViewName = EditorNames.EDIT_WEBSITE_PAGE_DETAILS;
        console.log('Generating page model');
        viewModel = this.generatePageViewModel(state, action);
        break;
      }
      case ComponentTypes.Layout: {
        componentViewName = EditorNames.EDIT_LAYOUT_DETAILS;
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    const options = _.cloneDeep(action.payload.options);
    const modelNodeId = options.modelNodeId;
    let model;
    if (modelNodeId) {
      model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));
    } else {
      model = { parentId: action.payload.options.parentModelId, typeLabel: type };
    }

    const data = Object.assign({}, options, { id: f22Uuid.generate() }, { model }, { viewModel });

    return {
      componentViewName,
      data
    };
  }

  generateView(model) {
    let view;
    switch (model.typeLabel) {
      case ComponentTypes.WebPage: {
        view = Object.assign({}, viewFactory.createPageView(), { viewModel: this.generateViewModel(model) });
        break;
      }
      case ComponentTypes.Layout: {
        view = Object.assign({}, viewFactory.createLayoutView(), { viewModel: this.generateViewModel(model) });
        break;
      }
      default: {
        throw new Error('Encountered error trying to determine view to create.');
      }
    }

    return view;
  }

  generateViewModel(itemParent) {
    itemParent.children.forEach((model, index) => {
      itemParent.children[index] = this.generateView(model);
    });

    return itemParent;
  }

  generatePageViewModel(state, action) {
    const options = _.cloneDeep(action.payload.options);
    const model = _.cloneDeep(graphTraversal.find(state.model, options.modelNodeId));

    return this.generateView(model);
  }

  generatePageChildComponent(state, action) {
    const options = _.cloneDeep(action.payload.options);
    const parentModel = graphTraversal.find(state, options.parentId);
    const model = modelGenerator.generate(parentModel.viewModel.id, action.payload.componentType);
    const viewModel = this.generateView(model);

    console.log(JSON.stringify(parentModel));

    parentModel.viewModel.children.push(viewModel);
  }
}

export default new ActionComponentCreator();
