import React, { PropTypes } from 'react';
import CreateLayout from '../buttons/CreateLayout';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <CreateLayout viewModel={this.props.selectedViewModel} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object
};

export default Toolbar;
