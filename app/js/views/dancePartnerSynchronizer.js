import _ from 'lodash';
import viewUtils from './viewUtils';
import ViewTypes from '../views/ViewTypes';
import dashboardIslandViewModelFactory from '../views/DashboardIslandViewModelFactory';

class DancePartnerSynchronizer {
  update(stateNew) {
    const viewIsland = viewUtils.findSingle(ViewTypes.Dashboard.Island, stateNew);

    // c.lo(viewIsland, 'viewIsland: ');

    // const stateClone = _.cloneDeep(stateNew);
    // const viewIslandClone = _.cloneDeep(viewIsland);
    dashboardIslandViewModelFactory.syncModelToViewModel(stateNew, viewIsland.viewModel.children[0]);

    // c.lo(viewIslandClone, 'viewIslandClone: ');
  }
}

export default new DancePartnerSynchronizer();
