import React, { PropTypes } from 'react';
import AddDropDownListbox from '../buttons/AddDropDownListBox';
import AddDiv from '../buttons/AddDiv';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <AddDropDownListbox viewModel={this.props.selectedViewModel} />
        <AddDiv viewModel={this.props.selectedViewModel} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default Toolbar;
