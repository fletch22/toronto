import Service from './Service';
import blockadeAndDrainService from '../../js/service/blockadeAndDrainService';
import collectionService from '../service/collectionService';
import modalDispatcher from '../component/modals/modalDispatcher';
import gridHelper from '../domain/collection/gridHelper';
import { actionGridRowSaved } from '../actions/grid';
import _ from 'lodash';

class GridService extends Service {

  lookupCollectionIdFromDataModelId(id) {
    return this.fetch(`${this.url}/dataModels/${id}/lookupCollectionId/`, 'POST');
  }

  persist(dispatch, ownProps, rowIdsUpdated, updatePropAndVals) {
    const grid = ownProps.gridViewModel;

    c.lo(rowIdsUpdated, 'rowIdsUpdated: ');

    let rawRows = null;
    if (rowIdsUpdated.length === 0) {
      const rows = gridHelper.addNewRow(grid.data.columns, []);
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

    const rowsToPersist = rawRows.map((rawRow) => {
      return gridHelper.convertRowToPersist(rawRow);
    });

    const persistObject = {
      collectionId: grid.data.collectionId,
      rows: rowsToPersist
    };

    const successCallback = (result) => {
      result.persistedIds.forEach((id, index) => {
        gridHelper.setId(rawRows[index], id);
      });
      dispatch(actionGridRowSaved(ownProps.gridViewModel.id, rawRows));
    };

    const dispatchHelper = () => {
      const createUpdate = (cuDispatch) => {
        try {
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

      return blockadeAndDrainService.invoke(createUpdate, successCallback);
    };

    dispatch(dispatchHelper());
  }
}

export default new GridService();
