import graphTraversal from './graphTraversal';
import _ from 'lodash';
import ViewTypes from '../../app/js/views/ViewTypes';

class StateTraversal {
  findHighestId(node) {
    return _.max(graphTraversal.collectPropValuesByPropName(node, 'id').filter((value) => typeof value !== typeof ''));
  }

  getNextId(node) {
    let highestId = node.currentId;

    c.l(`highestId: ${highestId}`);

    if (!highestId) {
      highestId = this.findHighestId(node) + 1;
    } else {
      highestId += 1;
    }
    /* eslint-disable no-param-reassign */
    node.currentId = highestId;

    c.l(`CurrentId: ${node.currentId}`);
    return node.currentId;
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
