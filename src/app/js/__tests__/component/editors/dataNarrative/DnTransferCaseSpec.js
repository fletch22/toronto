import { expect } from 'chai';
import DnTransferCase from '../../../../component/editors/dataNarrative/DnTransferCase';
import ComponentTypes from '../../../../../../common/domain/component/ComponentTypes';
import stateTraversal from '../../../../../../common/state/stateTraversal';
import modelGenerator from '../../../../domain/component/modelGenerator';
import viewModelFactory from '../../../../reducers/viewModelFactory';
import dnTransferCaseUtility from 'app/js/component/editors/dataNarrative/dnEditorTransferCase/dnTransferCaseUtility';

const generateModelAndAddToViewParent = (state, parentModel, typeLabel) => {
  const modelNew = modelGenerator.generate(state, parentModel.id, typeLabel);
  parentModel.children.push(modelNew);
  return modelNew;
};

const oldSourceFieldIds = ['old-2345', 'old-3456'];

// const getState = () => {
//   const state = {
//     model: {},
//     currentId: 0
//   };
//   const rootParentId = null;
//   const webPageModel = modelGenerator.generate(state, rootParentId, ComponentTypes.WebPage);
//   generateModelAndAddToViewParent(state, webPageModel, ComponentTypes.DropDownListbox);
//   const buttonSubmitModel = generateModelAndAddToViewParent(state, webPageModel, ComponentTypes.ButtonSubmit);
//   const dataNarrativeModel = generateModelAndAddToViewParent(state, buttonSubmitModel, ComponentTypes.DataNarrative);
//   const dnBrowserModel = generateModelAndAddToViewParent(state, dataNarrativeModel, ComponentTypes.DnBrowser);
//   dnBrowserModel.sourceFieldIds = oldSourceFieldIds.concat(buttonSubmitModel.id);
//   const dnConnectorOutNexusModel = generateModelAndAddToViewParent(state, dnBrowserModel, ComponentTypes.DnConnectorOutNexus);
//   generateModelAndAddToViewParent(state, dnConnectorOutNexusModel, ComponentTypes.DnConnector);
//
//   state.views = viewModelFactory.generateViewModel(rootParentId, webPageModel);
//   state.model = webPageModel;
//
//   return state;
// };

describe('DnTransferCase', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should succesfully determine if transfer case has refId when it does not', () => {
    // Arrange
    const refIdExists = stateTraversal.createReference('foo');
    const refIdNotExists = stateTraversal.createReference('bar');

    let child = {};
    child = { ...child, ...refIdExists };
    const dnTransferCaseModel = {
      children: [child]
    };

    // Act
    const doesExist = dnTransferCaseUtility.hasField(dnTransferCaseModel, refIdNotExists.$ref);

    // Asert
    expect(false).to.equal(doesExist);
  });

  it('should successfully determine if transfer case has refId.', () => {
    // Arrange
    const refIdExists = stateTraversal.createReference('foo');

    let child = {};
    child = { ...child, ...refIdExists };
    const dnTransferCaseModel = {
      children: [child]
    };

    // Act
    const doesExist = dnTransferCaseUtility.hasField(dnTransferCaseModel, refIdExists.$ref);

    // Assert
    expect(true).to.equal(doesExist);
  });

  it('should add a field if absent', () => {
    // Arrange
    const refIdExists = stateTraversal.createReference('foo');
    const dnTransferCaseModel = {
      children: []
    };

    const dnTransferCaseModelAdded = {
      children: [refIdExists]
    };

    sandbox.stub(dnTransferCaseUtility, 'hasField').returns(false);
    sandbox.stub(dnTransferCaseUtility, 'addField').returns(dnTransferCaseModelAdded);

    const referenceIds = [
      refIdExists
    ];

    const state = {};

    // Act
    const dnTransferCaseModelCopy = dnTransferCaseUtility.ensureRefFieldAdded(state, referenceIds, dnTransferCaseModel, refIdExists, ComponentTypes.DnTransferTargetField);

    // Assert
    expect(dnTransferCaseModelCopy.children.length).to.equal(1);
  });
});

