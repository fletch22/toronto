import _ from 'lodash';
import dnTransferSourceFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferSourceFieldModelFactory';
import dnTransferTargetFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferTargetFieldModelFactory';
import { default as ComponentTypes } from 'common/domain/component/ComponentTypes';


class DnTransferCaseUtility {
  addField(state, ref, dnTransferCaseModel, componentType) {
    const dnTransferCaseModelResult = _.cloneDeep(dnTransferCaseModel);

    let transferField;
    switch (componentType) {
      case ComponentTypes.DnTransferSourceField: {
        transferField = dnTransferSourceFieldModelFactory.createInstance(state, dnTransferCaseModelResult.id, ref);
        break;
      }
      case ComponentTypes.DnTransferTargetField: {
        transferField = dnTransferTargetFieldModelFactory.createInstance(state, dnTransferCaseModelResult.id, ref);
        break;
      }
      default: {
        throw new Error(`Encountered problem while trying to determine type of transfer case field. What is ${componentType}`);
      }
    }

    dnTransferCaseModelResult.children.push(transferField);

    return dnTransferCaseModelResult;
  }

  hasField(dnTransferCaseModel, refValue) {
    return !!dnTransferCaseModel.children.find((child) => child.$ref === refValue);
  }

  ensureRefFieldAdded = (state, refs, dnTransferCaseModel, componentType) => {
    let dnTransferCaseModelResult = _.cloneDeep(dnTransferCaseModel);

    for (const ref of refs) {
      if (!this.hasField(dnTransferCaseModelResult, ref.$ref)) {
        dnTransferCaseModelResult = this.addField(state, ref, dnTransferCaseModelResult, componentType);
      }
    }

    return dnTransferCaseModelResult;
  }
}

export default new DnTransferCaseUtility();
