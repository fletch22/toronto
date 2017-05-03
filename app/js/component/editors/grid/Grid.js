import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
import { actionAddNewEmptyRowToGrid, actionSelectRows, actionDeselectRows } from '../../../actions/grid';
import GridToolbar from './GridToolbar';
import crudActionCreator from '../../../../js/actions/crudActionCreator';
import collectionService from '../../../service/collectionService';
import modalDispatcher from '../../modals/modalDispatcher';

class Grid extends React.Component {

  render() {
    const self = this;
    const rowGetter = function (i) {
      return self.props.rows[i];
    };

    return (
      <div className="row" style={{ height: '90%', width: '95%', padding: '0 0 0 30px' }}>
        <GridToolbar
          disableAddButton={this.props.toolbar.addButtonDisabled}
          onClickAdd={this.props.onClickAddRow}
          onClickSave={this.props.onClickSave}
        />
        <ReactDataGrid
          enableRowSelect
          columns={this.props.gridViewModel.data.columns}
          rowGetter={rowGetter}
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
  selectedIndexes: PropTypes.array
};

const persist = (dispatch, ownProps) => {

  const successCallback = () => {
    c.l('Success callback fired.');
  };

  const dispatchHelper = () => {
    const createUpdate = (cuDispatch, state) => {
      try {
        const orbTypeInternalId = -1;
        const record = {};

        return collectionService.persist(orbTypeInternalId, record)
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

    return crudActionCreator.invoke(createUpdate, successCallback);
  };

  dispatch(dispatchHelper());
};


const mapStateToProps = (state, ownProps) => {

  const grid = ownProps.gridViewModel;
  c.lo(grid.selectedIndexes, 'ownProps.selectedIndexes: ');

  let selectedIndexes = [];
  if (Array.isArray(grid.selectedIndexes)) {
    selectedIndexes = (grid.selectedIndexes);
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
    onGridRowsUpdated: () => {
      c.l('onGridRowsUpdated...');
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
