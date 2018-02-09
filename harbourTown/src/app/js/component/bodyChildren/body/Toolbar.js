import React, { PropTypes } from 'react';
import CreateLayout from '../buttons/CreateLayout';
import AddDiv from '../buttons/AddDiv';

class Toolbar extends React.Component {
  render() {
    return (
      <div>
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
