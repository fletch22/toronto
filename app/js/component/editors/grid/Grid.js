import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
const { Toolbar } = require('react-data-grid-addons');
import { actionAddNewEmptyRowToGrid } from '../../../actions/grid';

class Grid extends React.Component {

  render() {
    const self = this;
    const rowGetter = function (i) {
      return self.props.rows[i];
    };


    return (
      <div className="row" style={{ height: '90%', width: '95%', padding: '0 0 0 30px' }}>
        <ReactDataGrid
          columns={this.props.columns}
          rowGetter={rowGetter}
          rowsCount={this.props.rows.length}
          minHeight={390}
          toolbar={<Toolbar onAddRow={this.props.onClickAddRow} />}
        />
      </div>
    );
  }
}

Grid.propTypes = {
  viewId: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
  onClickAddRow: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddRow: () => {
      c.l('About to send action...');
      dispatch(actionAddNewEmptyRowToGrid(ownProps.viewId));
    }
  };
};

Grid = connect(
  null,
  mapDispatchToProps
)(Grid);


export default Grid;
