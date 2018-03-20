import Service from './Service';
import blockadeAndDrainService from '../../js/service/blockadeAndDrainService';
import collectionService from '../service/collectionService';
import modalDispatcher from '../component/modals/modalDispatcher';
import gridHelper from '../domain/collection/gridHelper';
import { actionGridRowSaved, actionGridRowDelete } from '../actions/grid';
import _ from 'lodash';
import graphTraversal from '../../../common/state/graphTraversal';
import ComponentTypes from '../../../common/domain/component/ComponentTypes';
import StatePackager from '../service/StatePackager';
import stateSyncService from '../service/stateSyncService';
import crudActionCreator from '../actions/crudActionCreator';
import actionBodyChildSelectorHandler from "../reducers/actionBodyChildSelectorHandler";
import {actionHideCurrentModal, actionShowErrorModal} from "../actions";
import validationUtils from "../util/validationUtil";
import stateUtil from "../util/stateUtil";
import viewModelCreator from "../component/utils/viewModelCreator";

class GridService extends Service {

  lookupCollectionIdFromDataModelId(id) {
    return this.fetch(`${this.url}/dataModels/${id}/lookupCollectionId/`, 'POST');
  }

  delete(dispatch, ownProps, rowIndexes) {

    const helper = () => {
      const persist = (dispatchInner, state) => {
        const stateOld = JSON.stringify(state);

        const collection = graphTraversal.find(state.model, ownProps.collectionId);
        rowIndexes.sort().reverse().forEach((item) => {
          collection.userData.splice(item, 1);
        });

        const statePackager = new StatePackager();
        const statePack = statePackager.package(stateOld, JSON.stringify(state));
        return stateSyncService.saveState(statePack)
          .then((result) => result.state);
      };

      return crudActionCreator.invoke(persist);
    };

    dispatch(helper());
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
      rawRows = rowIdsUpdated.map((id) => {
        const rawSingleRow = _.find(grid.data.rows, (gridRow) => gridRow.id === id);
        return Object.assign(rawSingleRow, updatePropAndVals);
      });
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

    const persistObject = {
      collectionId: grid.data.dataModelId,
      rows: rowsToPersist
    };

    const dataModel = graphTraversal.find(state.model, grid.data.collectionId);

    const row = [];
    const dataFields = dataModel.children.filter((child) => child.typeLabel === ComponentTypes.DataField);

    persistObject.rows.forEach((persistRow) => {
      row[0] = persistRow[gridHelper.CONSTANTS.IDENTITY_KEY_NAME];
      dataFields.forEach((field) => {
        row.push(persistRow.fields[field.label]);
      });
      if (isNew) {
        dataModel.userData.unshift(row);
      } else {
        const rowIndex = _.findIndex(dataModel.userData, (rowUserData) => {
          return rowUserData[0] === row[0];
        });
        dataModel.userData.splice(rowIndex, 1, row);
      }
    });

    const dispatchHelper = () => {
      const persist = () => {
        const statePackager = new StatePackager();
        c.l(`State current ID ap: ${state.currentId}`);
        const statePack = statePackager.package(JSON.stringify(stateOld), JSON.stringify(state));
        return stateSyncService.saveState(statePack)
          .then((result) => {
            c.l(`result.state current ID ap: ${result.state.currentId}`);
            return result.state;
          });
      };

      return crudActionCreator.invoke(persist);
    };

    dispatch(dispatchHelper());
  }
}

export default new GridService();
