import React, { PropTypes } from 'react';
import Button from '../toolbar/Button';

class ConfigureSubmitButton extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa fa-cog " onClick={this.props.onClick} tooltipText="Configure Select" disabled={this.props.disabled} />
      </div>
    );
  }
}

ConfigureSubmitButton.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default ConfigureSubmitButton;
