import graphTraversal from './graphTraversal';
import _ from 'lodash';
import ViewTypes from '../../app/js/views/ViewTypes';
import ComponentTypes from '../domain/component/ComponentTypes';

class StateTraversal {
  constructor() {
    this.REF_ID_ATTRIBUTE = '$ref';
  }

  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id').filter((value) => typeof value !== typeof ''));
  }

  getNextId(state) {
    let highestId = state.currentId;

    if (!highestId && highestId !== 0) {
      highestId = this.findHighestId(state) + 1;
    } else {
      highestId += 1;
    }
    /* eslint-disable no-param-reassign */
    state.currentId = highestId;

    return state.currentId;
  }

  findIslandWithId(state, id) {
    const islands = state.views.filter((view) => view.viewType === ViewTypes.Dashboard.Island);

    return _.find(islands, (isle) => {
      return !!graphTraversal.find(isle, id);
    });
  }

  findAllWithTypeLabel(node, typeLabel) {
    const collection = graphTraversal.traverseAndCollect(node, 'typeLabel');
    return collection.filter((item) => item.typeLabel === typeLabel);
  }

  findAncestorViewWithModelTypeLabel(rootishNode, viewNode, typeLabel) {
    const viewModel = viewNode.viewModel;
    if (viewModel.hasOwnProperty('typeLabel') && viewModel.typeLabel === typeLabel) {
      return viewNode;
    } else {
      if (viewNode.hasOwnProperty('parentId')) {
        const parentViewNode = graphTraversal.find(rootishNode, viewNode.parentId);
        if (parentViewNode !== rootishNode) {
          return this.findAncestorViewWithModelTypeLabel(rootishNode, parentViewNode, typeLabel);
        } else {
          throw new Error(`Encountered problem trying to find viewModel ancestor \'${typeLabel}\' in ${JSON.stringify(viewNode)}. Traversed to the provided root but could not find parent.`);
        }
      } else {
        throw new Error(`Encountered problem trying to find ancestor \'${typeLabel}\' in ${JSON.stringify(viewNode)}`);
      }
    }
  }

  findDescendentViewWithModelId(viewNode, modelId) {
    const viewModel = viewNode.viewModel;
    if (viewModel.hasOwnProperty('typeLabel') && viewModel.id === modelId) {
      return viewNode;
    }

    let resultViewNode = null;
    if (viewModel.children) {
      for (const childView of viewModel.children) {
        const childViewModel = this.findDescendentViewWithModelId(childView, modelId);
        if (!!childViewModel) {
          resultViewNode = childViewModel;
          break;
        }
      }
    }

    return resultViewNode;
  }

  findAllWithTypeLabels(node, typeLabelArray) {
    let result = [];
    typeLabelArray.forEach((typeLabel) => {
      result = result.concat(this.findAllWithTypeLabel(node, typeLabel));
    });
    return result;
  }

  getWebPageFormFieldsAsRefs(modelNode, node) {
    const webPageModel = graphTraversal.findAncestorByTypeLabel(modelNode, node, ComponentTypes.WebPage);
    return this.getAllFieldsFromModelAsRefs(webPageModel);
  }

  getAllFieldsFromModelAsRefs(model) {
    const fieldArray = this.findAllWithTypeLabels(model, [ComponentTypes.DropDownListbox]);
    return fieldArray.map((field) => this.createModelReferenceFromField(field));
  }

  syncWebPageFormFields(rootishNode, id) {
    const node = graphTraversal.find(rootishNode, id);
    return this.getWebPageFormFieldsAsRefs(rootishNode, node);
  }

  createModelReferenceFromField(field) {
    return this.createReference(field.id);
  }

  createReference(id) {
    const result = {};
    result[this.REF_ID_ATTRIBUTE] = id;
    return result;
  }

  getRefIdsFromNode(node) {
    return graphTraversal.collectPropValuesByPropName(node, this.REF_ID_ATTRIBUTE);
  }

  isReference(value) {
    return (typeof value === 'object' && this.REF_ID_ATTRIBUTE in value && Object.keys(value).length === 1);
  }

  extractRelationshipIdFromReference(value) {
    return value[this.REF_ID_ATTRIBUTE];
  }
}

export default new StateTraversal();
