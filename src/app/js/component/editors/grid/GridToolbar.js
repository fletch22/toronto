import React, { PropTypes } from 'react';
import Button from '../../../component/bodyChildren/toolbar/Button';

class GridToolbar extends React.Component {

  constructor() {
    super();
    this.onClickAdd = this.onClickAdd.bind(this);
  }

  onClickAdd(event) {
    if (!this.props.disableAddButton) {
      this.props.onClickAdd(event);
    }
  }

  render() {
    return (
      <div className="sel_view_toolbar">
        <Button faClass="fa-plus" disabled={this.props.disableAddButton} onClick={this.onClickAdd} tooltipText="Add" />
        <Button faClass="fa-minus" disabled={this.props.disableDeleteButton} onClick={this.props.onClickRemove} tooltipText="Delete" />
      </div>
    );
  }
}

GridToolbar.propTypes = {
  disableAddButton: PropTypes.bool,
  disableDeleteButton: PropTypes.bool,
  disableUploadButton: PropTypes.bool,
  disableRefreshButton: PropTypes.bool,
  onClickAdd: PropTypes.func,
  onClickRemove: PropTypes.func,
  onClickCancel: PropTypes.func,
  onClickRefresh: PropTypes.func
};

export default GridToolbar;
