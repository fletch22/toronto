import React, { PropTypes } from 'react';
import Button from '../../../../../toolbar/Button';

class SelectCollectionToolbar extends React.Component {
  render() {
    return (
      <div className="sel_view_toolbar">
        <Button faClass="fa-plus" disabled={this.props.disableCollectionButtons} onClick={this.props.onClickAddCollection} tooltipText="Add Collection" />
        <Button faClass="fa-minus" disabled={this.props.disableCollectionButtons} onClick={this.props.onClickRemoveCollection} tooltipText="Delete Collection" />
      </div>
    );
  }
}

SelectCollectionToolbar.propTypes = {
  viewId: PropTypes.string,
  buttonNextDisabled: PropTypes.bool,
  datastores: PropTypes.array,
  onClickAddCollection: PropTypes.func,
  onClickRemoveCollection: PropTypes.func,
  disableCollectionButtons: PropTypes.bool
};

export default SelectCollectionToolbar;
