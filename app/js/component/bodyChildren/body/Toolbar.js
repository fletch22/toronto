import React, { PropTypes } from 'react';
import CreateLayout from '../buttons/CreateLayout';

class Toolbar extends React.Component {
  render() {
    return (
      <CreateLayout viewModel={this.props.selectedViewModel} />
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default Toolbar;
