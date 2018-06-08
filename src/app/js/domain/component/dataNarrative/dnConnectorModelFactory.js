import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import dnTransferCaseModelFactory from './dnTransferCaseModelFactory';

class DnConnectorModelFactory extends ModelFactory {
  createInstance(state, parentId, connectorInNexusId) {
    const id = this.getNextId(state);
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnConnector,
      connectorInNexusId,
      children: [this.createDnTransferCase(state, id)]
    };
  }

  createDnTransferCase(state, parentId) {
    return dnTransferCaseModelFactory.createInstance(state, parentId);
  }
}

export default new DnConnectorModelFactory();

