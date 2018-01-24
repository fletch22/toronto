import viewUtils from './viewUtils';
import ViewTypes from '../views/ViewTypes';
import dashboardIslandViewModelFactory from '../views/DashboardIslandViewModelFactory';

class DancePartnerSynchronizer {
  update(stateNew) {
    const viewIsland = viewUtils.findSingle(ViewTypes.Dashboard.Island, stateNew);

    dashboardIslandViewModelFactory.syncModelToViewModel(stateNew, viewIsland.viewModel.children[0]);
  }
}

export default new DancePartnerSynchronizer();
