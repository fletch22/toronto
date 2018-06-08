import graphTraversal from '../../../common/state/graphTraversal';


class StateUtil {

  constructor() {
    this.graphTraversal = graphTraversal;
  }

  getUniquePropertyValue(state, propertyName, prefix) {
    const existingNames = this.graphTraversal.collectPropValuesByPropName(state.model, propertyName);

    let count = 1;
    let syntheticValue = '';
    for (;;) {
      syntheticValue = `${prefix}-${count}`;
      if (!existingNames.includes(syntheticValue)) {
        break;
      }
      count++;
    }
    return syntheticValue;
  }

  findAncestorByTypeLabel(rootishNode, node, typeLabel) {
    return this.graphTraversal.findAncestorByTypeLabel(rootishNode, node, typeLabel);
  }

  findAncestorByTypeLabelCollection(rootishNode, node, typeLabelArray) {
    let result = null;
    for (const typeLabel of typeLabelArray) {
      const foundNode = this.graphTraversal.findAncestorByTypeLabelWithNull(rootishNode, node, typeLabel);
      if (foundNode) {
        result = foundNode;
        break;
      }
    }
    return result;
  }
}

export default new StateUtil();
