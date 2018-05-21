import { expect } from 'chai';
import DnTransferCase from '../../../component/editors/dataNarrative/dnTransferCase/DnTransferCase';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import stateTraversal from '../../../../../common/state/stateTraversal';
import modelGenerator from '../../../domain/component/modelGenerator';
import viewModelFactory from '../../../reducers/viewModelFactory';
import graphTraversal from 'common/state/graphTraversal';

const generateModelAndAddToViewParent = (state, parentModel, typeLabel) => {
  const modelNew = modelGenerator.generate(state, parentModel.id, typeLabel);
  parentModel.children.push(modelNew);
  return modelNew;
};

const oldSourceFieldIds = ['old-2345', 'old-3456'];

const getState = () => {
  const state = {
    model: {},
    currentId: 0
  };
  const rootParentId = null;
  const webPageModel = modelGenerator.generate(state, rootParentId, ComponentTypes.WebPage);
  generateModelAndAddToViewParent(state, webPageModel, ComponentTypes.DropDownListbox);
  const buttonSubmitModel = generateModelAndAddToViewParent(state, webPageModel, ComponentTypes.ButtonSubmit);
  const dataNarrativeModel = generateModelAndAddToViewParent(state, buttonSubmitModel, ComponentTypes.DataNarrative);
  const dnBrowserModel = generateModelAndAddToViewParent(state, dataNarrativeModel, ComponentTypes.DnBrowser);
  dnBrowserModel.sourceFieldIds = oldSourceFieldIds.concat(buttonSubmitModel.id);
  const dnConnectorOutNexusModel = generateModelAndAddToViewParent(state, dnBrowserModel, ComponentTypes.DnConnectorOutNexus);
  generateModelAndAddToViewParent(state, dnConnectorOutNexusModel, ComponentTypes.DnConnector);

  state.views = viewModelFactory.generateViewModel(rootParentId, webPageModel);
  state.model = webPageModel;

  return state;
};

describe('DnTransferCase', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it.only('should find resolve compare recorded sourceFieldIds and the actual successfully.', () => {
    // Arrange
    const actionStatePackage = {
      stateNew: getState()
    };

    const dnTransferCaseModel = stateTraversal.findAllWithTypeLabel(actionStatePackage.stateNew.model, ComponentTypes.DnTransferCase)[0];
    const dnTransferCaseView = stateTraversal.findDescendentViewWithModelId(actionStatePackage.stateNew.views, dnTransferCaseModel.id);
    const args = {
      id: dnTransferCaseView.id
    };

    const ddlModel = stateTraversal.findAllWithTypeLabel(actionStatePackage.stateNew.model, ComponentTypes.DropDownListbox)[0];

    const expectedFormFields = [stateTraversal.createModelReference(ddlModel)];
    const getWebPageFormFieldsStub = sandbox.stub(stateTraversal, 'getWebPageFormFields').returns(expectedFormFields);

    // Act
    DnTransferCase.onClick(actionStatePackage, args);

    // Assert
    expect(getWebPageFormFieldsStub.calledOnce).to.equal(true);
  });
});

