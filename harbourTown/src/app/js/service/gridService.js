import Service from './Service';
import modalDispatcher from '../component/modals/modalDispatcher';
import gridHelper from '../domain/collection/gridHelper';
import _ from 'lodash';
import graphTraversal from '../../../common/state/graphTraversal';
import ComponentTypes from '../../../common/domain/component/ComponentTypes';
import StatePackager from '../service/StatePackager';
import stateSyncService from '../service/stateSyncService';
import crudActionCreator from '../actions/crudActionCreator';

class GridService extends Service {

  lookupCollectionIdFromDataModelId(id) {
    return this.fetch(`${this.url}/dataModels/${id}/lookupCollectionId/`, 'POST');
  }

  delete(dispatch, ownProps, rowIndexes) {
    throw new Error('Not implemented');
  }

  persist(state, dispatch, ownProps, rowIdsUpdated, updatePropAndVals) {
    const stateOld = _.cloneDeep(state);
    const grid = ownProps.gridViewModel;
    const isNew = (rowIdsUpdated.length === 0);

    let rawRows = null;
    if (isNew) {
      const rows = gridHelper.addNewRow(state, grid.data.columns, []);
      rawRows = [rows[0]];
    } else {
      // c.l('About to update rows ...');
      rawRows = rowIdsUpdated.map((id) => {
        const rawSingleRow = _.find(grid.data.rows, (gridRow) => gridRow.id === id);
        // c.lo(rawSingleRow, 'rawSingleRows: ');
        return Object.assign(rawSingleRow, updatePropAndVals);
      });
      // c.lo(rawRows, 'rawRows: ');
    }

    if (!rawRows) {
      const error = {
        name: 'Save Error',
        message: 'Encountered error while trying to save/update grid row. Don\'t know which row to persist.'
      };
      modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to save/update grid row.', dispatch);
      return;
    }

    const rowsToPersist = rawRows.map((row) => {
      return gridHelper.convertRowToPersist(row);
    });

    // c.lo(rowsToPersist, 'rowsToPersist: ');

    const persistObject = {
      collectionId: grid.data.dataModelId,
      rows: rowsToPersist
    };

    const dataModel = graphTraversal.find(state.model, grid.data.collectionId);
    const row = [];
    const dataFields = dataModel.children.filter((child) => child.typeLabel === ComponentTypes.DataField);

    // c.lo(dataFields, 'dataFields: ');

    persistObject.rows.forEach((persistRow) => {
      // c.lo(persistRow, 'persistRow: ');
      row[0] = persistRow[gridHelper.CONSTANTS.IDENTITY_KEY_NAME];
      dataFields.forEach((field) => {
        row.push(persistRow.fields[field.label]);
      });
      if (isNew) {
        dataModel.userData.unshift(row);
      } else {
        c.lo(row, 'Updating...');
        const rowIndex = _.findIndex(dataModel.userData, (rowUserData) => {
          // c.lo(rowUserData, 'rowUserData...');
          return rowUserData[0] === row[0];
        });

        // c.l(`RowIndex: ${rowIndex}`);

        dataModel.userData.splice(rowIndex, 1, row);
      }
    });


    // c.lo(dataModel.userData, 'dataModel.userData in persist: ');

    // const successCallback = (result) => {
    //   result.persistedIds.forEach((id, index) => {
    //     gridHelper.setId(rawRows[index], id);
    //   });
    //   dispatch(actionGridRowSaved(ownProps.gridViewModel.id, rawRows));
    // };
    //
    // c.lo(persistObject, 'persistObject: ');

    const dispatchHelper = () => {
      const persist = () => {
        const statePackager = new StatePackager();
        const statePack = statePackager.package(JSON.stringify(stateOld), JSON.stringify(state));
        return stateSyncService.saveState(statePack)
          .then((result) => result.state);
      };

      return crudActionCreator.invoke(persist);
    };

    dispatch(dispatchHelper());
  }
}

export default new GridService();
