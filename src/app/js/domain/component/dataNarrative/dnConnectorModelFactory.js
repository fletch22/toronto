import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import dnTransferCaseModelFactory from './dnTransferCaseModelFactory';

class DnConnectorModelFactory extends ModelFactory {
  createInstance(state, parentId, connectorInNexusId, sourceAndTargetModels) {
    const id = this.getNextId(state);
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnConnector,
      connectorInNexusId,
      children: [this.createDnTransferCase(state, id, sourceAndTargetModels)]
    };
  }

  createDnTransferCase(state, parentId, sourceAndTargetModels) {
    return dnTransferCaseModelFactory.createInstance(state, parentId, sourceAndTargetModels);
  }
}

export default new DnConnectorModelFactory();

