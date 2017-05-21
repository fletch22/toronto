import Service from './Service';
import blockadeAndDrainService from '../../js/service/blockadeAndDrainService';
import collectionService from '../service/collectionService';
import modalDispatcher from '../component/modals/modalDispatcher';
import gridHelper from '../domain/collection/gridHelper';
import { actionGridRowSaved } from '../actions/grid';

class GridService extends Service {

  lookupCollectionIdFromDataModelId(id) {
    return this.fetch(`${this.url}/dataModels/${id}/lookupCollectionId/`, 'POST');
  }

  persist(dispatch, ownProps, rowIdsUpdated, updatePropAndVals) {
    const grid = ownProps.gridViewModel;

    let row = null;
    const numberToUpdate = rowIdsUpdated.length;
    if (numberToUpdate === 1) {
      const rowId = rowIdsUpdated[0];
      const rows = grid.data.rows;
      row = _.find(rows, (rowThing) => rowThing.id === rowId);
      row = Object.assign(row, updatePropAndVals);
    } else if (numberToUpdate > 1) {
      c.l('Multi-row update not supported.');
    } else {
      const rows = gridHelper.addNewRow(grid.data.columns, []);
      row = rows[0];
    }

    const successCallback = (result) => {
      gridHelper.setId(row, result.orbInternalId);
      dispatch(actionGridRowSaved(ownProps.gridViewModel.id, row));
    };

    const dispatchHelper = () => {
      const createUpdate = (cuDispatch) => {
        try {
          if (!row) {
            const error = {
              name: 'Save Error',
              message: 'Encountered error while trying to save/update grid row. Don\'t know which row to persist.'
            };
            modalDispatcher.dispatchErrorModal(error, 'Encountered error while trying to save/update grid row.', cuDispatch);
            return Promise.reject(error);
          }

          const rowPersist = gridHelper.convertRowToPersist(row);

          const persistObject = {
            collectionId: grid.data.collectionId,
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

      return blockadeAndDrainService.invoke(createUpdate, successCallback);
    };

    dispatch(dispatchHelper());
  }
}

export default new GridService();
