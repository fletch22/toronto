import graphTraversal from '../state/graphTraversal';


class StateUtil {

  constructor() {
    this.graphTraversal = graphTraversal;
  }

  getUniquePropertyValueAmongTypes(state, typeLabel, propertyName, prefix) {
    const existingNames = this.graphTraversal.collectPropValuesByTypeLabelAndPropertyName(state.model, typeLabel, propertyName);

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
}

export default new StateUtil();
