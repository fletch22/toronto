import React, { PropTypes } from 'react';
import CreateLayout from '../buttons/CreateLayout';
import ToggleBorder from '../buttons/ToggleBorder';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <CreateLayout viewModel={this.props.selectedViewModel} />
        <ToggleBorder viewModel={this.props.selectedViewModel} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default Toolbar;
