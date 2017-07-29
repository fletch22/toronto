import React, { PropTypes } from 'react';
import CreateLayout from '../buttons/CreateLayout';
import AddDiv from '../buttons/AddDiv';

class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <CreateLayout viewModel={this.props.selectedViewModel} />
        <AddDiv viewModel={this.props.selectedViewModel} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default Toolbar;
