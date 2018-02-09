import graphTraversal from '../../../common/state/graphTraversal';
import ComponentTypes from '../../../common/domain/component/ComponentTypes';

class ActionBodyChildSelectorHandler {

  process(state, targetViewModelId) {
    const pageAndSelected = this.getPageViewModelAndSelectedViewModel(state, targetViewModelId);
    const pageViewNode = pageAndSelected.pageViewModel;
    const selectedViewModelIndex = pageAndSelected.selectedViewModelIndex;

    if (pageViewNode.needsSaving) {
      return state;
    }

    if (pageViewNode.selectedChildViewId && pageViewNode.selectedChildViewId !== targetViewModelId) {
      const parentOfExisting = graphTraversal.findParent(state, pageViewNode.selectedChildViewId);
      if (parentOfExisting) {
        parentOfExisting.viewModel.children = [].concat(parentOfExisting.viewModel.children);
      }
    }
    pageViewNode.selectedChildViewId = targetViewModelId;

    const borderScrivener = { ...state.borderScrivener };
    borderScrivener.selectedElementId = pageViewNode.selectedChildViewId;
    borderScrivener.selectedElementIndex = selectedViewModelIndex;
    borderScrivener.visible = !!borderScrivener.selectedElementId;

    /* eslint-disable no-param-reassign */
    state.borderScrivener = borderScrivener;

    return state;
  }

  getPageViewModelAndSelectedViewModel(state, childIdInQuestion) {
    let parentOfIntended = graphTraversal.findParent(state, childIdInQuestion);

    let pageViewModel;
    let selectedViewModel;

    if (parentOfIntended) {
      parentOfIntended = { ...parentOfIntended };
      selectedViewModel = graphTraversal.find(parentOfIntended.viewModel, childIdInQuestion);

      parentOfIntended.viewModel.children = [].concat(parentOfIntended.viewModel.children);

      pageViewModel = selectedViewModel;
      let parentNodeId = selectedViewModel.parentId;
      let typeLabel = selectedViewModel.viewModel.typeLabel;
      while (typeLabel !== ComponentTypes.WebPage) {
        const parentNode = graphTraversal.find(state, parentNodeId);
        if (!parentNode) {
          throw new Error('Encountered problem trying to find web page root node.');
        }
        parentNodeId = parentNode.parentId;
        pageViewModel = parentNode;
        typeLabel = parentNode.viewModel.typeLabel;
      }
    } else {
      pageViewModel = graphTraversal.find(state, childIdInQuestion);
      selectedViewModel = pageViewModel;
    }

    // NOTE: 10-17-2017: fleschec: There will be no parent if this is Body -- the outermost parent.
    let selectedViewModelIndex = 0;
    if (!!parentOfIntended) {
      selectedViewModelIndex = graphTraversal.getChildsIndex(parentOfIntended.viewModel.children, selectedViewModel.id);
    }

    return {
      pageViewModel,
      selectedViewModel,
      selectedViewModelIndex
    };
  }
}

export default new ActionBodyChildSelectorHandler();
