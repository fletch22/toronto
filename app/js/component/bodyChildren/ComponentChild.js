import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';
import LayoutMinion from './LayoutMinion';
import Div from './div/Div';
import DropDownListbox from './dropDownListbox/DropDownListbox';
import ButtonSubmit from './buttonSubmit/ButtonSubmit';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import graphTraversal from '../../state/graphTraversal';
import { actionHoverOver } from '../../actions/dnd/index.js';
import ActionInvoker from '../../actions/ActionInvoker';
import MoveComponentService from '../../service/MoveComponentService';
import modalDispatcher from '../../component/modals/modalDispatcher';
import StatePackager from '../../service/StatePackager';
import crudActionCreator from '../../actions/crudActionCreator';
import borderScrivenerUtils from '../../component/utils/borderScrivenerUtils';

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
  cancelDrag: PropTypes.func
};

ComponentChild = dragDropContext(HTML5Backend)(ComponentChild);

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
  const draggedParentModel = graphTraversal.find(state.model, draggedViewModel.viewModel.parentId);
  const draggedItemModel = draggedParentModel.children[dnd.indexDraggedItem];

  // Last operation on dragged viewModel: set new model parent Id;
  draggedViewModel.viewModel.parentId = hoverParentViewModel.viewModel.id;

  // Find hover model parent.
  const hoverParentModel = graphTraversal.find(state.model, hoverParentViewModel.viewModel.id);

  // Remove dragged model item from its parent.
  draggedParentModel.children.splice(dnd.indexDraggedItem, 1);
  draggedParentModel.children = [].concat(draggedParentModel.children);

  // Add dragged model item to hover model parent.
  hoverParentModel.children.splice(indexChildTarget, 0, draggedItemModel);
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
    draggedModelId: draggedViewModel.viewModel.id
  };
};

const persistMove = () => {
  const moveStuff = (dispatch, state) => {
    try {
      const jsonStateOld = JSON.stringify(state);
      const moveInfo = moveInState(JSON.parse(jsonStateOld));

      const statePackager = new StatePackager();
      const statePackage = statePackager.package(jsonStateOld, JSON.stringify(moveInfo.state));

      return MoveComponentService.move(statePackage, moveInfo.draggedParentModelId, moveInfo.hoveredParentModelId, moveInfo.draggedModelId)
        .then((result) => {
          console.debug('Success Callback.');
          return Promise.resolve(result);
        })
        .catch((error) => {
          console.debug('Failure Callback.');
          modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to create/update component.', dispatch);
          return Promise.reject(error);
        });
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

  const draggedItem = graphTraversal.find(stateNew, dnd.draggedId);
  draggedItem.visibility = true;

  stateNew.dragNDrop = getDndOnEnd();

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    move: (draggedId, hoverId, position) => {
      dispatch(persistMove());
    },
    hoverOver: (draggedId, hoverOveredId, measurements) => {
      dispatch(hoverOver(draggedId, hoverOveredId, measurements));
    },
    cancelDrag: () => {
      ActionInvoker.invoke(dispatch, cancelDragStateChange);
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
