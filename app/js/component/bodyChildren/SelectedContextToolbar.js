import React, { PropTypes } from 'react';
import { default as DropDownListboxToolbar } from './dropDownListbox/FullToolbar';
import { default as ButtonSubmitToolbar } from './buttonSubmit/FullToolbar';
import ComponentTypes from '../../domain/component/ComponentTypes';
import FlagSelContextToolbar from './FlagSelContextToolbar';

class SelectedContextToolbar extends React.Component {

  render() {
    let contextToolbar = null;

    switch (this.props.selectedViewModel.viewModel.typeLabel) {
      case ComponentTypes.DropDownListbox:
        contextToolbar = (<DropDownListboxToolbar selectedViewModel={this.props.selectedViewModel} />);
        break;
      case ComponentTypes.ButtonSubmit: {
        contextToolbar = <ButtonSubmitToolbar selectedViewModel={this.props.selectedViewModel} />;
        break;
      }
      default:
        contextToolbar = (<FlagSelContextToolbar selectedViewModel={this.props.selectedViewModel} />);
    }

    return (
      <div>
        { contextToolbar }
      </div>
    );
  }
}

SelectedContextToolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default SelectedContextToolbar;

