import graphTraversal from './graphTraversal';
import _ from 'lodash';
import ViewTypes from "../views/ViewTypes";

class StateTraversal {
  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id'));
  }

  getNextId(node) {
    return this.findHighestId(node) + 1;
  }

  findIslandWithId(state, id) {
    const islands = state.views.filter((view) => view.viewType === ViewTypes.Dashboard.Island);

    return _.find(islands, (isle) => {
      return !!graphTraversal.find(isle, id);
    });
  }
}

export default new StateTraversal();
