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
        component = <PhantomDropper id={this.props.id} />;
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

const persistMove = (actionStatePackage, args) => {
  const state = actionStatePackage.state;
  const stateNew = actionStatePackage.stateNew;
  const draggedId = args[0];

  const draggedItem = graphTraversal.find(stateNew, draggedId);
  draggedItem.visibility = true;

  // xxx
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
};

const hoverOver = (draggedId, hoverOveredId, position) => {
  return (dispatch, getState) => {
    const state = getState();

    const dnd = state.dragNDrop;
    if (dnd.draggedId !== draggedId
      || dnd.hoverOverId !== hoverOveredId
      || dnd.position !== position) {
      dispatch(actionHoverOver(draggedId, hoverOveredId, position));
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

  const parentOfHover = graphTraversal.find(stateNew, dnd.parentOfHoverOverId);
  const draggedItem = parentOfHover.viewModel.children.slice(dnd.indexChildTarget, 1);
  draggedItem.visibility = true;

  const parentOfDragged = graphTraversal.find(stateNew, dnd.parentOfDraggedItemId);
  parentOfDragged.viewModel.children.slice(dnd.indexDraggedItem, 0, draggedItem);

  stateNew.dragNDrop = {
    hoverOverId: null,
    parentOfHoverOverId: null,
    draggedId: null,
    indexDraggedItem: null,
    parentOfDraggedItemId: null,
    indexChildTarget: null,
    position: null
  };

  return actionStatePackage.state;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (draggedId, hoverId, position) => {
      c.l('Move called.');
      // dispatch(persistMove(...arguments));
      ActionInvoker.invoke(dispatch, persistMove, [draggedId, hoverId, position]);
    },
    hoverOver: (draggedId, hoverOveredId, position) => {
      c.l('hoverCalled!');
      dispatch(hoverOver(draggedId, hoverOveredId, position));
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
