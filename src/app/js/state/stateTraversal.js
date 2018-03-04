import graphTraversal from '../../../common/state/graphTraversal';
import _ from 'lodash';
import ViewTypes from '../views/ViewTypes';

class StateTraversal {
  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id').filter((value) => typeof value !== typeof ''));
  }

  getNextId(state) {
    let highestId = state.currentId;

    c.l(`highestId: ${highestId}`);

    if (!highestId) {
      highestId = this.findHighestId(state) + 1;
    } else {
      highestId += 1;
    }
    /* eslint-disable no-param-reassign */
    state.currentId = highestId;

    c.l(`CurrentId: ${state.currentId}`);
    return state.currentId;
  }

  findIslandWithId(state, id) {
    const islands = state.views.filter((view) => view.viewType === ViewTypes.Dashboard.Island);

    return _.find(islands, (isle) => {
      return !!graphTraversal.find(isle, id);
    });
  }
}

export default new StateTraversal();
