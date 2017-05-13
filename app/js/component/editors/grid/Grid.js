import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
import { actionAddNewEmptyRowToGrid, actionSelectRows, actionDeselectRows, actionUpdateRow } from '../../../actions/grid';
import GridToolbar from './GridToolbar';
import crudActionCreator from '../../../../js/actions/crudActionCreator';
import collectionService from '../../../service/collectionService';
import modalDispatcher from '../../modals/modalDispatcher';
import gridHelper from '../../../domain/collection/gridHelper';

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
          onClickSave={this.props.onClickSave}
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
  onClickSave: PropTypes.func,
  toolbar: PropTypes.object,
  onRowsSelected: PropTypes.func,
  onRowsDeselected: PropTypes.func,
  selectedIndexes: PropTypes.array,
  onClickRemove: PropTypes.func,
  collectionId: PropTypes.any
};

const persist = (dispatch, ownProps) => {

  const successCallback = () => {
    c.l('Success callback fired.');
  };

  const dispatchHelper = () => {
    const createUpdate = (cuDispatch, state) => {
      try {
        const orbTypeInternalId = -1;

        const grid = ownProps.gridViewModel;
        const selectedRows = grid.selectedIndexes.map((index) => {
          return grid.data.rows[index];
        });

        c.lo(ownProps.gridViewModel, 'gvm: ');

        const rowPersist = gridHelper.convertRowToPersist(selectedRows[0]);
        const persistObject = {
          collectionId: ownProps.gridViewModel.data.collectionId,
          row: rowPersist
        };

        return collectionService.saveOrb(persistObject)
          .then((result) => {
            console.debug('Success Callback.');
            return Promise.resolve(result);
          })
          .catch((error) => {
            console.debug('Failure Callback.');
            modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to create/update record.', cuDispatch);
            return Promise.reject(error);
          });
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    };

    if (successCallback === undefined) {
      c.l('No success callback used.');
    }

    createUpdate();
    // return crudActionCreator.invoke(createUpdate, successCallback);
  };

  dispatchHelper();
  // dispatch(dispatchHelper());
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
      dispatch(actionAddNewEmptyRowToGrid(ownProps.gridViewModel.id));
    },
    onClickSave: () => {
      persist(dispatch, ownProps);
    },
    onGridRowsUpdated: (rows) => {
      const action = rows.action;
      if (action === 'CELL_UPDATE') {
        dispatch(actionUpdateRow(ownProps.gridViewModel.id, { rowIds: rows.rowIds, updatedCells: rows.updated }));
      } else {
        console.error(`Encountered grid cell update action '${action}'. Code to handle this action is not yet implemented.`);
      }
    },
    onRowsSelected: (selectedRows) => {
      dispatch(actionSelectRows(ownProps.gridViewModel.id, getSelectedIndexes(selectedRows)));
    },
    onRowsDeselected: (selectedRows) => {
      dispatch(actionDeselectRows(ownProps.gridViewModel.id, getSelectedIndexes(selectedRows)));
    }
  };
};

Grid = connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);


export default Grid;
