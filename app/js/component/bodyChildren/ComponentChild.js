import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';
import LayoutMinion from './LayoutMinion';
import Div from './div/Div';
import DropDownListbox from './dropDownListbox/DropDownListbox';
import ButtonSubmit from './buttonSubmit/ButtonSubmit';
import PhantomDropper from '../dragAndDrop/PhantomDropper';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import graphTraversal from '../../state/graphTraversal';
import modalDispatcher from '../../component/modals/modalDispatcher';
import MoveComponentService from '../../service/MoveComponentService';
import { actionHoverOver } from '../../actions/dnd/index.js';
import ActionInvoker from '../../actions/ActionInvoker';
import phantomDropperModelFactory from '../../domain/component/phantomDropperModelFactory';

class ComponentChild extends React.Component {
  render() {
    let component;
    switch (this.props.viewModel.viewModel.typeLabel) {
      case ComponentTypes.Layout: {
        component = <GridLayout id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
        break;
      }
      case ComponentTypes.LayoutMinion: {
        component = <LayoutMinion id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
        break;
      }
      case ComponentTypes.Div: {
        component = (<Div id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected}
          move={this.props.move} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag}
          moveAsPhantom={this.props.moveAsPhantom}
        />);
        break;
      }
      case ComponentTypes.DropDownListbox: {
        component = <DropDownListbox id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
        break;
      }
      case ComponentTypes.ButtonSubmit: {
        component = (<ButtonSubmit id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected}
          move={this.props.move} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag}
          moveAsPhantom={this.props.moveAsPhantom}
        />);
        break;
      }
      case ComponentTypes.PhantomDropper: {
        component = (<PhantomDropper id={this.props.id} viewModel={this.props.viewModel} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag}
          moveAsPhantom={this.props.moveAsPhantom}
        />);
        break;
      }
      default: {
        console.error('Encountered problem while trying to determine view name for pseudo modal.');
        break;
      }
    }

    return (
      component
    );
  }
}

ComponentChild.propTypes = {
  id: PropTypes.any,
  isSelected: PropTypes.bool,
  viewModel: PropTypes.object,
  move: PropTypes.func,
  hoverOver: PropTypes.func,
  dragNDrop: PropTypes.object,
  cancelDrag: PropTypes.func,
  moveAsPhantom: PropTypes.func
};

ComponentChild = dragDropContext(HTML5Backend)(ComponentChild);

const persistMoveOld = (draggedId, hoverId, position) => {
  return (dispatch, getState) => {
    // c.l(`Persist Move: draggedId: ${draggedId}; hoverId: ${hoverId}`);

    const state = getState();

    try {
      const jsonStateOld = JSON.stringify(state);
      const stateNew = JSON.parse(jsonStateOld);

      const draggedItem = graphTraversal.find(stateNew, draggedId);
      draggedItem.visibility = true;
      // const draggedParentViewModel = graphTraversal.find(stateNew, draggedItem.parentId);
      // const hoverParentViewModel = graphTraversal.findParent(stateNew, hoverId);
      //
      // const draggedViewModelChildIndex = graphTraversal.getChildsIndex(draggedParentViewModel.viewModel.children, draggedId);
      // draggedParentViewModel.viewModel.children.splice(draggedViewModelChildIndex, 1);
      //
      // const modelId = draggedParentViewModel.viewModel.id;
      // const draggedParentModel = graphTraversal.findParent(stateNew.model, modelId);
      //
      // const hoverModelId = hoverParentViewModel.viewModel.id;
      // const hoverParentModel = graphTraversal.findParent(stateNew.model, hoverModelId);
      //
      // const draggedModelChildIndex = graphTraversal.getChildsIndex(draggedParentModel.children, modelId);
      // draggedParentModel.children.splice(draggedModelChildIndex, 1);

      return stateNew;

      // return MoveComponentService.move(draggedParentModel.id, hoverParentModel.id, modelId)
      //   .then((result) => {
      //     console.debug('Success Callback.');
      //     return Promise.resolve(result);
      //   })
      //   .catch((error) => {
      //     console.debug('Failure Callback.');
      //     modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to create/update component.', dispatch);
      //     return Promise.reject(error);
      //   });
    } catch (error) {
      console.error(error);
    }
  };
};

const getDndOnEnd = (state) => {
  /* eslint-disable no-param-reassign */
  return {
    hoverOverId: null,
    parentOfHoverOverId: null,
    draggedId: null,
    indexDraggedItem: null,
    parentOfDraggedItemId: null,
    indexChildTarget: null,
    phantomDropperId: null,
    position: null,
    measurements: null
  };
};

const persistMove = (actionStatePackage) => {
  const state = actionStatePackage.state;
  const stateNew = actionStatePackage.stateNew;
  const dnd = stateNew.dragNDrop;

  // Find dragged item vm and parent.
  const draggedParentViewModel = graphTraversal.find(stateNew, dnd.parentOfDraggedItemId);
  const draggedViewModel = draggedParentViewModel.viewModel.children[dnd.indexDraggedItem];

  // Find hover parent.
  const hoverParentViewModel = graphTraversal.find(stateNew, dnd.parentOfHoverOverId);

  let indexChildTarget = dnd.indexChildTarget;

  // Remove dragged vm item from its parent.
  draggedParentViewModel.viewModel.children.splice(dnd.indexDraggedItem, 1);
  draggedParentViewModel.viewModel.children = [].concat(draggedParentViewModel.viewModel.children);
  if (draggedParentViewModel.id === hoverParentViewModel.id) {
    if (dnd.indexDraggedItem < indexChildTarget) {
      indexChildTarget -= 1;
    }
  }

  // // Add dragged vm item to hover vm parent.
  hoverParentViewModel.viewModel.children.splice(indexChildTarget, 0, draggedViewModel);
  hoverParentViewModel.viewModel.children = [].concat(hoverParentViewModel.viewModel.children);
  draggedViewModel.parentId = hoverParentViewModel.id;

  // Find dragged model and hover model parent.
  const draggedParentModel = graphTraversal.find(stateNew.model, draggedViewModel.viewModel.parentId);
  const draggedItemModel = draggedParentModel.children[dnd.indexDraggedItem];

  // NOTE: 010-01-2017: This can be removed once Drag N Drop seems to be stable.
  if (!draggedItemModel) {
    c.l('Aborting!!!!!!');
    state.dragNDrop = getDndOnEnd();
    return state;
  }

  // Last operation on dragged viewModel: set new model parent Id;
  draggedViewModel.viewModel.parentId = hoverParentViewModel.viewModel.id;

  // Find hover model parent.
  const hoverParentModel = graphTraversal.find(stateNew.model, hoverParentViewModel.viewModel.id);

  // Remove dragged model item from its parent.
  draggedParentModel.children.splice(dnd.indexDraggedItem, 1);
  draggedParentModel.children = [].concat(draggedParentModel.children);

  // Add dragged model item to hover model parent.
  hoverParentModel.children.splice(indexChildTarget, 0, draggedItemModel);
  hoverParentModel.children = [].concat(hoverParentModel.children);
  draggedItemModel.parentId = hoverParentModel.id;

  draggedViewModel.visibility = true;
  stateNew.dragNDrop = getDndOnEnd();

  return stateNew;
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

const moveAsPhantomStateChange = (actionStatePackage) => {
  const stateNew = actionStatePackage.stateNew;
  const state = actionStatePackage.state;

  const dnd = stateNew.dragNDrop;

  let endState = state;
  if (dnd.draggedId !== dnd.hoverOverId) {
    const parentOfDragged = graphTraversal.find(stateNew, dnd.parentOfDraggedItemId);
    const draggedItem = parentOfDragged.viewModel.children.splice(dnd.indexDraggedItem, 1)[0];
    parentOfDragged.viewModel.children = [].concat(parentOfDragged.viewModel.children);

    const parentOfHover = graphTraversal.find(stateNew, dnd.parentOfHoverOverId);
    parentOfHover.viewModel.children.splice(dnd.indexChildTarget, 0, draggedItem);
    draggedItem.parentId = parentOfHover.id;
    parentOfHover.viewModel.children = [].concat(parentOfHover.viewModel.children);
    endState = stateNew;
  }
  return endState;
};

const cancelDragStateChange = (actionStatePackage) => {
  const stateNew = actionStatePackage.stateNew;
  const dnd = stateNew.dragNDrop;

  const draggedItem = graphTraversal.find(stateNew, dnd.draggedId);
  draggedItem.visibility = true;

  stateNew.dragNDrop = getDndOnEnd();

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (draggedId, hoverId, position) => {
      ActionInvoker.invoke(dispatch, persistMove);
    },
    hoverOver: (draggedId, hoverOveredId, measurements) => {
      // c.l('hoverCalled!');
      dispatch(hoverOver(draggedId, hoverOveredId, measurements));
    },
    cancelDrag: () => {
      ActionInvoker.invoke(dispatch, cancelDragStateChange);
    },
    moveAsPhantom: () => {
      ActionInvoker.invoke(dispatch, moveAsPhantomStateChange);
    }
  };
};

const mapStateToProps = (state, ownProps) => {
  const dragNDrop = state.dragNDrop;

  return {
    id: ownProps.id,
    isSelected: ownProps.isSelected,
    viewModel: ownProps.viewModel,
    move: ownProps.move,
    hoverOver: ownProps.hoverOver,
    dragNDrop
  };
};

ComponentChild = connect(
  null,
  mapDispatchToProps
)(ComponentChild);

export default ComponentChild;
