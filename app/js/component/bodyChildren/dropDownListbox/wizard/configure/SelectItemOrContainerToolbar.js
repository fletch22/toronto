import React, { PropTypes } from 'react';
import Button from '../../../toolbar/Button';

class SelectItemOrContainerToolbar extends React.Component {
  render() {
    return (
      <div className="sel_view_toolbar">
        <Button faClass="fa-plus" disabled={this.props.disableButtons} onClick={this.props.onClickAdd} tooltipText="Add Collection" />
        <Button faClass="fa-minus" disabled={this.props.disableButtons} onClick={this.props.onClickRemove} tooltipText="Delete Collection" />
      </div>
    );
  }
}

SelectItemOrContainerToolbar.propTypes = {
  viewId: PropTypes.string,
  onClickAdd: PropTypes.func,
  onClickRemove: PropTypes.func,
  disableButtons: PropTypes.bool
};

export default SelectItemOrContainerToolbar;
