import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import Div from './div/Div';
import DropDownListbox from './dropDownListbox/DropDownListbox';
import ButtonSubmit from './buttonSubmit/ButtonSubmit';
import DragAndDropUtils from '../dragAndDrop/DragAndDropUtils';
import borderScrivenerUtils from '../utils/borderScrivenerUtils';

class ComponentChild extends React.Component {
  render() {
    let component;
    switch (this.props.viewModel.viewModel.typeLabel) {
      case ComponentTypes.Div: {
        component = (<Div id={this.props.id} viewModel={this.props.viewModel} onClick={this.props.onClick}
          move={this.props.move} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag} isSelected={this.props.isSelected} isHoveringOver={this.props.isHoveringOver}
        />);
        break;
      }
      case ComponentTypes.DropDownListbox: {
        component = (<DropDownListbox
          id={this.props.id}
          viewModel={this.props.viewModel}
          onClick={this.props.onClick}
          move={this.props.move}
          hoverOver={this.props.hoverOver}
          cancelDrag={this.props.cancelDrag}
          isSelected={this.props.isSelected}
          isHoveringOver={this.props.isHoveringOver}
          visibility={this.props.visibility}
          style={this.props.style}
          children={this.props.children}
        />);
        break;
      }
      case ComponentTypes.ButtonSubmit: {
        component = (<ButtonSubmit id={this.props.id} viewModel={this.props.viewModel} onClick={this.props.onClick}
          move={this.props.move} hoverOver={this.props.hoverOver} cancelDrag={this.props.cancelDrag} isSelected={this.props.isSelected} isHoveringOver={this.props.isHoveringOver}
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
  viewModel: PropTypes.object,
  move: PropTypes.func,
  onClick: PropTypes.func,
  hoverOver: PropTypes.func,
  dragNDrop: PropTypes.object,
  cancelDrag: PropTypes.func,
  isSelected: PropTypes.bool,
  isHoveringOver: PropTypes.bool,
  children: PropTypes.any,
  style: PropTypes.string,
  visibility: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    isSelected: borderScrivenerUtils.isSelected(state, ownProps.id),
    isHoveringOver: ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId,
    children: ownProps.viewModel.viewModel.children,
    style: ownProps.viewModel.style,
    visibility: ownProps.viewModel.visibility
  };
};

ComponentChild = connect(
  mapStateToProps,
  DragAndDropUtils.mapDispatchToProps
)(ComponentChild);

export default ComponentChild;

