import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
import { actionSelectRow, actionDeselectRow } from '../../../actions/grid';
import GridToolbar from './GridToolbar';
import gridService from '../../../service/gridService';

class Grid extends React.Component {

  constructor() {
    super();
    this.rowGetter = this.rowGetter.bind(this);
  }

  rowGetter(i) {
    return this.props.rows[i];
  }

  render() {
    return (
      <div className="row f22-grid ag-fresh">
        <GridToolbar
          disableAddButton={this.props.toolbar.addButtonDisabled}
          onClickAdd={this.props.onClickAddRow}
          onClickRemove={this.props.onClickRemove}
        />
        <ReactDataGrid
          enableRowSelect
          enableCellSelect
          columns={this.props.gridViewModel.data.columns}
          rowGetter={this.rowGetter}
          rowsCount={this.props.rows.length}
          minHeight={390}
          onGridRowsUpdated={this.props.onGridRowsUpdated}
          rowSelection={{
            showCheckbox: true,
            onRowsSelected: this.props.onRowsSelected,
            onRowsDeselected: this.props.onRowsDeselected,
            selectBy: {
              indexes: this.props.selectedIndexes
            }
          }}
        />
      </div>
    );
  }
}

Grid.propTypes = {
  gridViewModel: PropTypes.object,
  rows: PropTypes.array,
  onClickAddRow: PropTypes.func,
  onGridRowsUpdated: PropTypes.func,
  toolbar: PropTypes.object,
  onRowsSelected: PropTypes.func,
  onRowsDeselected: PropTypes.func,
  selectedIndexes: PropTypes.array,
  onClickRemove: PropTypes.func,
  collectionId: PropTypes.any
};

const mapStateToProps = (state, ownProps) => {
  const grid = ownProps.gridViewModel;

  let selectedIndexes = [];
  if (Array.isArray(grid.selectedIndexes)) {
    selectedIndexes = grid.selectedIndexes;
  }

  return {
    gridViewModel: ownProps.gridViewModel,
    rows: ownProps.gridViewModel.data.rows,
    toolbar: ownProps.gridViewModel.toolbar,
    selectedIndexes
  };
};

const getSelectedIndexes = (selectedRows) => {
  const selectedIndexes = [];
  selectedRows.forEach((row) => {
    selectedIndexes.push(row.rowIdx);
  });
  return selectedIndexes;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddRow: () => {
      const updatedPropAndVals = null;
      gridService.persist(dispatch, ownProps, [], updatedPropAndVals);
    },
    onGridRowsUpdated: (rows) => {
      const action = rows.action;
      if (action === 'CELL_UPDATE' || action === 'CELL_DRAG') {
        gridService.persist(dispatch, ownProps, rows.rowIds, rows.updated);
      } else {
        console.error(`Encountered grid cell update action '${action}'. Code to handle this action is not yet implemented.`);
      }
    },
    onRowsSelected: (selectedRows) => {
      dispatch(actionSelectRow(ownProps.gridViewModel.id, getSelectedIndexes(selectedRows)));
    },
    onRowsDeselected: (selectedRows) => {
      dispatch(actionDeselectRow(ownProps.gridViewModel.id, getSelectedIndexes(selectedRows)));
    }
  };
};

Grid = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);


export default Grid;
