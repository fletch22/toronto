import graphTraversal from './graphTraversal';
import _ from 'lodash';
import ViewTypes from '../../app/js/views/ViewTypes';

class StateTraversal {
  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id').filter((value) => typeof value !== typeof ''));
  }

  getNextId(state) {
    let highestId = state.currentId;

    if (!highestId) {
      highestId = this.findHighestId(state) + 1;
    } else {
      highestId += 1;
    }
    /* eslint-disable no-param-reassign */
    state.currentId = highestId;

    return state.currentId;
  }

  findIslandWithId(state, id) {
    const islands = state.views.filter((view) => view.viewType === ViewTypes.Dashboard.Island);

    return _.find(islands, (isle) => {
      return !!graphTraversal.find(isle, id);
    });
  }

  findAllWithTypeLabel(node, typeLabel) {
    const collection = graphTraversal.traverseAndCollect(node, 'typeLabel');
    return collection.filter((item) => item.typeLabel === typeLabel);
  }
}

export default new StateTraversal();
