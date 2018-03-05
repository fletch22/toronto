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
    let component = null;

    c.lo(this.props.model, 'model: ');

    if (this.props.model) {
      c.lo(this.props.model.typeLabel, 'typeLabel');

      switch (this.props.model.typeLabel) {
        case ComponentTypes.Div: {
          component = (<Div model={this.props.model} />);
          break;
        }
        case ComponentTypes.DropDownListbox: {
          component = (<DropDownListbox model={this.props.model} />);
          break;
        }
        case ComponentTypes.ButtonSubmit: {
          component = (<ButtonSubmit model={this.props.model} />);
          break;
        }
        default: {
          console.error('Encountered problem while trying to determine view name for pseudo modal.');
          break;
        }
      }
    }

    return (
      component
    );
  }
}

ComponentChild.propTypes = {
  model: PropTypes.object
};

export default ComponentChild;

