import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import dnTransferCaseModelFactory from './dnTransferCaseModelFactory';

class DnConnectorModelFactory extends ModelFactory {
  createInstance(state, parentId, connectorInNexusId, dataSourceId) {
    const id = this.getNextId(state);

    const dnConnectorModel = {
      id,
      parentId,
      typeLabel: ComponentTypes.DnConnector,
      connectorInNexusId,
      children: [this.createDnTransferCase(state, id, dataSourceId)]
    };

    return dnConnectorModel;
  }

  createDnTransferCase(state, parentId, dataSourceId) {
    return dnTransferCaseModelFactory.createInstance(state, parentId, dataSourceId);
  }
}

export default new DnConnectorModelFactory();

