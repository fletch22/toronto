import React, { PropTypes } from 'react';
import Button from '../../../../../toolbar/Button';

class ButtonAddCollection extends React.Component {
  render() {
    return (
      <Button faClass="fa-plus" onClick={this.props.onClick} tooltipText="Configure Select" />
    );
  }
}

ButtonAddCollection.propTypes = {
  onClick: PropTypes.func
};

export default ButtonAddCollection;
