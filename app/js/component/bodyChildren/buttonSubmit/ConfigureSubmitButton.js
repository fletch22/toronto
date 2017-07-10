import React, { PropTypes } from 'react';
import Button from '../toolbar/Button';

class ConfigureSubmitButton extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa fa-cog " onClick={this.props.onClick} tooltipText="Configure Select" />
      </div>
    );
  }
}

ConfigureSubmitButton.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func
};

export default ConfigureSubmitButton;
