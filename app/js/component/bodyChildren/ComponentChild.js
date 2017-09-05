import React, { PropTypes } from 'react';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';
import LayoutMinion from './LayoutMinion';
import Div from './div/Div';
import DropDownListbox from './dropDownListbox/DropDownListbox';
import ButtonSubmit from './buttonSubmit/ButtonSubmit';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class ComponentChild extends React.Component {

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
  }

  moveCard(dragIndex, hoverIndex) {
    c.l(`dragIndex: ${dragIndex}`);
  }

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
        component = <Div id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
        break;
      }
      case ComponentTypes.DropDownListbox: {
        component = <DropDownListbox id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} />;
        break;
      }
      case ComponentTypes.ButtonSubmit: {
        component = <ButtonSubmit id={this.props.id} viewModel={this.props.viewModel} isSelected={this.props.isSelected} moveCard={this.moveCard} />;
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
  viewModel: PropTypes.object
};

ComponentChild = dragDropContext(HTML5Backend)(ComponentChild);

export default ComponentChild;
