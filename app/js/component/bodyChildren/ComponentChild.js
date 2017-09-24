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
import modalDispatcher from '../../component/modals/modalDispatcher';
import MoveComponentService from '../../service/MoveComponentService';
import { actionHoverOver } from '../../actions/dnd/index.js';
import ActionInvoker from '../../actions/ActionInvoker';

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
          moveCard={this.props.moveCard} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag}
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
          moveCard={this.props.moveCard} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag}
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
  moveCard: PropTypes.func,
  hoverOver: PropTypes.func,
  dragNDrop: PropTypes.object,
  cancelDrag: PropTypes.func,
  moveAsPhantom: PropTypes.func
};

ComponentChild = dragDropContext(HTML5Backend)(ComponentChild);

const persistMove = (draggedId, hoverId, position) => {
  return (dispatch, getState) => {
    // c.l(`Persist Move: draggedId: ${draggedId}; hoverId: ${hoverId}`);

    const state = getState();
    try {
      const jsonStateOld = JSON.stringify(state);
      const stateNew = JSON.parse(jsonStateOld);

      const draggedParentViewModel = graphTraversal.findParent(stateNew, draggedId);
      const hoverParentViewModel = graphTraversal.findParent(stateNew, hoverId);

      const draggedViewModelChildIndex = graphTraversal.getChildsIndex(draggedParentViewModel.viewModel.children, draggedId);
      draggedParentViewModel.viewModel.children.splice(draggedViewModelChildIndex, 1);

      const modelId = draggedParentViewModel.viewModel.id;
      const draggedParentModel = graphTraversal.findParent(stateNew.model, modelId);

      const hoverModelId = hoverParentViewModel.viewModel.id;
      const hoverParentModel = graphTraversal.findParent(stateNew.model, hoverModelId);

      const draggedModelChildIndex = graphTraversal.getChildsIndex(draggedParentModel.children, modelId);
      draggedParentModel.children.splice(draggedModelChildIndex, 1);

      return MoveComponentService.move(draggedParentModel.id, hoverParentModel.id, modelId)
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
    moveCard: (draggedId, hoverId, position) => {
      c.l('Move called.');
      dispatch(persistMove(draggedId, hoverId));
    },
    hoverOver: (draggedId, hoverOveredId, position) => {
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
    moveCard: ownProps.moveCard,
    hoverOver: ownProps.hoverOver,
    dragNDrop
  };
};

ComponentChild = connect(
  null,
  mapDispatchToProps
)(ComponentChild);

export default ComponentChild;
