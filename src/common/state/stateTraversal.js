import graphTraversal from './graphTraversal';
import _ from 'lodash';
import ViewTypes from '../../app/js/views/ViewTypes';

class StateTraversal {
  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id').filter((value) => typeof value !== typeof ''));
  }

  getNextId(state) {
    let highestId = state.currentId;

    if (!highestId) {
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
    for (const childView of viewModel.children) {
      const childViewModel = this.findDescendentViewWithModelId(childView, modelId);
      if (!!childViewModel) {
        resultViewNode = childViewModel;
        break;
      }
    }

    return resultViewNode;
  }
}






export default new StateTraversal();
