import ModelFactory from '../ModelFactory';
import ComponentTypes from 'common/domain/component/ComponentTypes';
import referenceUtils from '../../../util/referenceUtils';
import graphTraversal from 'common/state/graphTraversal';

class DnTransferCaseModelFactory extends ModelFactory {
  createInstance(state, parentId, dataSourceId) {
    const id = this.getNextId(state);

    const dnTransferCaseModel = {
      id,
      parentId,
      typeLabel: ComponentTypes.DnTransferCase,
      fieldMapper: null,
      children: []
    };

    const node = graphTraversal.find(state, dataSourceId);

    referenceUtils.createReference(state, dnTransferCaseModel, 'dataSource', dataSourceId, `depends on ${node.typeLabel} '${dataSourceId}'`);

    return dnTransferCaseModel;
  }
}

export default new DnTransferCaseModelFactory();

