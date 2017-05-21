import f22uuid from '../../util/f22Uuid';
import _ from 'lodash';

export const GridViewModelConstants = {
  COLLECTION_ID_UNSET: -1
};

export const GridViewModel = {
  id: null,
  data: {
    collectionId: -1,
    rows: [],
    columns: []
  },
  needsToMakeDataRequest: true,
  selectedIndexes: [],
  toolbar: {
    addButtonDisabled: false
  }
};

class GridViewModelFactory {
  createInstance() {
    const gridViewModel = _.cloneDeep(GridViewModel);
    gridViewModel.id = f22uuid.generate();
    return gridViewModel;
  }
}

export default new GridViewModelFactory();
