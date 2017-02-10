import graphTraversal from '../state/graphTraversal';
import actionComponentCreator from './actionComponentCreatorHandler';

class ActionBodyChildSelectorHandler {

  process(state, targetViewModelId) {
    const parentOfIntended = graphTraversal.findParent(state, targetViewModelId);
    const intendedSelectedViewModel = graphTraversal.find(parentOfIntended.viewModel.children, targetViewModelId);
    parentOfIntended.viewModel.children = [].concat(parentOfIntended.viewModel.children);

    intendedSelectedViewModel.isSelected = true;

    let pageViewNode = intendedSelectedViewModel;
    let parentNodeId = intendedSelectedViewModel.parentId;
    while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
      const parentNode = graphTraversal.find(state, parentNodeId);
      if (!parentNode) {
        throw new Error('Encountered problem trying to find web page root node.');
      }
      parentNodeId = parentNode.parentId;
      pageViewNode = parentNode;
    }

    if (pageViewNode.selectedChildViewId && pageViewNode.selectedChildViewId !== intendedSelectedViewModel.id) {
      const parentOfExisting = graphTraversal.findParent(state, pageViewNode.selectedChildViewId);
      const currentlySelectedViewModel = graphTraversal.find(parentOfExisting.viewModel.children, pageViewNode.selectedChildViewId);
      currentlySelectedViewModel.isSelected = false;
      parentOfExisting.viewModel.children = [].concat(parentOfExisting.viewModel.children);
    }
    pageViewNode.selectedChildViewId = targetViewModelId;

    return state;
  }
}

export default new ActionBodyChildSelectorHandler();
