import graphTraversal from '../../../../common/state/graphTraversal';
import { actionHoverOver } from '../../actions/dnd/index.js';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import ActionInvoker from '../../actions/ActionInvoker';
import crudActionCreator from '../../actions/crudActionCreator';
import borderScrivenerUtils from '../../component/utils/borderScrivenerUtils';

const getDndOnEnd = () => {
  /* eslint-disable no-param-reassign */
  return {
    hoverOverId: null,
    parentOfHoverOverId: null,
    draggedId: null,
    indexDraggedItem: null,
    parentOfDraggedItemId: null,
    indexChildTarget: null,
    position: null,
    measurements: null,
    lastChildViewModelId: null
  };
};

const resetOrdinals = (children) => {
  children.forEach((child, index) => {
    child.ordinal = String(index);
  });
  children.sort((a, b) => {
    return parseInt(a.ordinal, 10) - parseInt(b.ordinal, 10);
  });
};

const moveInState = (state) => {
  const dnd = state.dragNDrop;

  // Find dragged item vm and parent.
  const draggedParentViewModel = graphTraversal.find(state, dnd.parentOfDraggedItemId);
  const draggedViewModel = draggedParentViewModel.viewModel.children[dnd.indexDraggedItem];

  // Find hover parent.
  const hoverParentViewModel = graphTraversal.find(state, dnd.parentOfHoverOverId);

  let indexChildTarget = dnd.indexChildTarget;

  // Remove dragged vm item from its parent.
  draggedParentViewModel.viewModel.children.splice(dnd.indexDraggedItem, 1);
  resetOrdinals(draggedParentViewModel.viewModel.children);
  draggedParentViewModel.viewModel.children = [].concat(draggedParentViewModel.viewModel.children);
  if (draggedParentViewModel.id === hoverParentViewModel.id) {
    if (dnd.indexDraggedItem < indexChildTarget) {
      indexChildTarget -= 1;
    }
  }

  // Add dragged vm item to hover vm parent.
  hoverParentViewModel.viewModel.children.splice(indexChildTarget, 0, draggedViewModel);
  resetOrdinals(hoverParentViewModel.viewModel.children);

  // draggedViewModel.viewModel.ordinal = indexChildTarget;
  hoverParentViewModel.viewModel.children = [].concat(hoverParentViewModel.viewModel.children);
  draggedViewModel.parentId = hoverParentViewModel.id;

  // Find dragged model and hover model parent.
  const draggedParentModel = graphTraversal.find(state.model, draggedViewModel.viewModel.parentId);
  const draggedItemModel = draggedParentModel.children[dnd.indexDraggedItem];

  // Last operation on dragged viewModel: set new model parent Id;
  draggedViewModel.viewModel.parentId = hoverParentViewModel.viewModel.id;

  // Find hover model parent.
  const hoverParentModel = graphTraversal.find(state.model, hoverParentViewModel.viewModel.id);

  // Remove dragged model item from its parent.
  draggedParentModel.children.splice(dnd.indexDraggedItem, 1);
  resetOrdinals(draggedParentModel.children);
  draggedParentModel.children = [].concat(draggedParentModel.children);

  // Add dragged model item to hover model parent.
  hoverParentModel.children.splice(indexChildTarget, 0, draggedItemModel);
  resetOrdinals(hoverParentModel.children);
  hoverParentModel.children = [].concat(hoverParentModel.children);
  draggedItemModel.parentId = hoverParentModel.id;

  draggedViewModel.visibility = true;

  state.borderScrivener.selectedElementId = dnd.draggedId;
  state.borderScrivener.needsUpdate = true;
  borderScrivenerUtils.domActionSyncer(state);

  state.dragNDrop = getDndOnEnd();

  return {
    state,
    draggedParentModelId: draggedParentModel.id,
    hoveredParentModelId: hoverParentModel.id,
    draggedModelId: draggedViewModel.viewModel.id,
    ordinalChildTarget: indexChildTarget
  };
};

const persistMove = () => {
  const moveStuff = (dispatch, state) => {
    try {
      return Promise.reject('Not implemented.');
    } catch (error) {
      console.error(error);
    }
  };

  return crudActionCreator.invoke(moveStuff);
};

const hoverOver = (draggedId, hoverOveredId, measurements) => {
  return (dispatch, getState) => {
    const state = getState();

    const dnd = state.dragNDrop;

    if (dnd.draggedId !== draggedId
      || dnd.hoverOverId !== hoverOveredId
      || dnd.measurements.position !== measurements.position
      || !dnd.measurements) {
      dispatch(actionHoverOver(draggedId, hoverOveredId, measurements));
    }
  };
};

const cancelDragStateChange = (actionStatePackage) => {
  const stateNew = actionStatePackage.stateNew;
  const dnd = stateNew.dragNDrop;

  if (dnd.draggedId) {
    const draggedItem = graphTraversal.find(stateNew, dnd.draggedId);
    draggedItem.visibility = true;
  }

  stateNew.dragNDrop = getDndOnEnd();

  return stateNew;
};

class DragAndDropUtils {

  static mapDispatchToProps(dispatch, ownProps) {
    return {
      move: () => {
        dispatch(persistMove());
      },
      hoverOver: (draggedId, hoverOveredId, measurements) => {
        dispatch(hoverOver(draggedId, hoverOveredId, measurements));
      },
      cancelDrag: () => {
        ActionInvoker.invoke(dispatch, cancelDragStateChange);
      },
      onClick: (event) => {
        event.stopPropagation();
        dispatch(actionSetCurrentBodyTool(ownProps.id));
      }
    };
  }
}

export default DragAndDropUtils;
