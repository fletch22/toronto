import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';
import Div from './div/Div';
import DropDownListbox from './dropDownListbox/DropDownListbox';
import ButtonSubmit from './buttonSubmit/ButtonSubmit';
import DragAndDropUtils from '../dragAndDrop/DragAndDropUtils';

class ComponentChild extends React.Component {
  render() {
    let component;
    switch (this.props.viewModel.viewModel.typeLabel) {
      case ComponentTypes.Layout: {
        component = <GridLayout id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
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


ComponentChild = connect(
  null,
  DragAndDropUtils.mapDispatchToProps
)(ComponentChild);

export default ComponentChild;
