import _ from 'lodash';
import viewModelCreator from '../../component/utils/viewModelCreator';

class LayoutChangeService {

  static handleLayoutChange(parentViewModel, layoutGridItems, dispatch) {
    const updatedViewModels = [];
    layoutGridItems.forEach((gridItem) => {
      const layoutMinion = this.findAssociatedViewModel(gridItem, parentViewModel.viewModel.children);
      if (layoutMinion) {
        const model = layoutMinion.viewModel;

        if (this.isGridInfoDifferent(gridItem, model)) {
          model.height = gridItem.h;
          model.width = gridItem.w;
          model.x = gridItem.x;
          model.y = gridItem.y;

          updatedViewModels.push(layoutMinion);
        }
      }
    });
    if (updatedViewModels.length > 0) {
      viewModelCreator.updateChildren(dispatch, updatedViewModels, parentViewModel.id);
    }
  }

  static isGridInfoDifferent(gridItem, viewModel) {
    const compareItem1 = { height: gridItem.h, width: gridItem.w, x: gridItem.x, y: gridItem.y };
    const compareItem2 = _.pick(viewModel, ['height', 'width', 'x', 'y']);
    return !_.isEqual(compareItem1, compareItem2);
  }

  static findAssociatedViewModel(gridItem, siblings) {
    return _.find(siblings, (layoutMinion) => {
      return layoutMinion.viewModel.key === gridItem.i;
    });
  }
}

export default LayoutChangeService;
