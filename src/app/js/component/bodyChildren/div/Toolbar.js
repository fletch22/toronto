import React, { PropTypes } from 'react';
import AddDropDownListbox from '../buttons/AddDropDownListBox';
import AddButtonSubmit from '../buttons/AddButtonSubmit';
import AddDiv from '../buttons/AddDiv';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <AddDropDownListbox viewModel={this.props.selectedViewModel} disabled={this.props.disabled} />
        <AddButtonSubmit viewModel={this.props.selectedViewModel} disabled={this.props.disabled} />
        <AddDiv viewModel={this.props.selectedViewModel} disabled={this.props.disabled} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  disabled: PropTypes.bool
};

export default Toolbar;
