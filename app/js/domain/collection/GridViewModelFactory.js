import f22uuid from '../../util/f22Uuid';

export const GridViewModel = {
  id: null,
  data: {
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
