import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentTypes from '../../domain/component/ComponentTypes';
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
        component = <DropDownListbox id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
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
  isHoveringOver: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    isSelected: borderScrivenerUtils.isSelected(state, ownProps.id),
    isHoveringOver: ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId
  };
};

ComponentChild = connect(
  mapStateToProps,
  DragAndDropUtils.mapDispatchToProps
)(ComponentChild);

export default ComponentChild;

