import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import dataUniverseModelUtils from '../../../domain/component/dataUniverseModelUtils';
import dataStoreModelUtils from '../../../domain/component/dataStoreModelUtils';
import _ from 'lodash';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import PropPathTextInput from '../../editors/PropPathTextInput';
import { actionShowErrorModal, actionHideCurrentModal, actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionPageNeedsSaving, actionPageDoesNotNeedSaving } from '../../../actions/bodyChildrenEditor/index';
import validationUtils from '../../../util/validationUtil';
import Button from '../../../component/bodyChildren/toolbar/Button';
import stateUtil from '../../../util/stateUtil';
import graphTraversal from '../../../state/graphTraversal';
import ComponentTypes from '../../../domain/component/ComponentTypes';

const DDL_UNSET = -1;

const getIsNeedsSaving = (userSelectData, data) => {
  const innerViewModel = data.selectedViewModel.viewModel;

  return userSelectData.elementId !== innerViewModel.elementId
    || (userSelectData.selectedDataStoreId !== DDL_UNSET && userSelectData.selectedDataStoreId !== innerViewModel.dataStoreId)
    || (userSelectData.selectedDataModelId !== DDL_UNSET && userSelectData.selectedDataModelId !== innerViewModel.dataModelId)
    || (userSelectData.selectedDataValueId !== DDL_UNSET && userSelectData.selectedDataValueId !== innerViewModel.dataValueId)
    || (userSelectData.selectedDataTextId !== DDL_UNSET && userSelectData.selectedDataTextId !== innerViewModel.dataTextId);
};

class FullToolbar extends React.Component {
  render() {
    const optionDataSources = this.props.dataStores.map((dataStore) => {
      return <option key={dataStore.id} value={dataStore.id} readOnly>{dataStore.label}</option>;
    });
    optionDataSources.unshift(<option key="select-one" value={DDL_UNSET} readOnly>(Select One)</option>);

    const optionCollections = this.props.collections.map((collection) => {
      return <option key={collection.id} value={collection.id} readOnly>{collection.label}</option>;
    });
    optionCollections.unshift(<option key="select-one" value={DDL_UNSET} readOnly>(Select One)</option>);

    const optionFields = this.props.fields.map((field) => {
      return <option key={field.id} value={field.id} readOnly>{field.label}</option>;
    });
    optionFields.unshift(<option key="select-one" value={DDL_UNSET} readOnly>(Select One)</option>);

    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div>
            <div className="bc-toolbar-title-label">
              { this.props.selectedViewModel.viewModel.typeLabel }
            </div>
            <div className="bc-toolbar-description">
              This is a select component.
            </div>
          </div>
          <div className="full-toolbar-data flex-normal">
            <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" disabled={!this.props.needsSaving} />
            <Button faClass="fa-undo" onClick={this.props.onClickRevert} tooltipText="Revert" />
          </div>
          <div className="full-toolbar-data flex-normal">
            <div>
              <label>Name:</label>
            </div>
            <div>
              <PropPathTextInput id={this.props.selectedViewModel.id} path="elementId" value={this.props.elementId}
                persistState={false} onBlur={this.props.onBlurName} onChangeExternal={this.props.onChangeElementId}
              />
            </div>
          </div>
          <div className="full-toolbar-data">
            <label>DataStore:</label>
            <select value={this.props.selectedDataStoreId} onChange={this.props.onChangeDataStore}>
              {
                optionDataSources
              }
            </select>
          </div>
          <div className="full-toolbar-data">
            <label>Collection:</label>
            <select value={this.props.selectedDataModelId} onChange={this.props.onChangeCollection}>
              {
                optionCollections
              }
            </select>
          </div>
          <div className="full-toolbar-data">
            <label>Data Value:</label>
            <select value={this.props.selectedDataValueId} onChange={this.props.onChangeDataValue}>
              {
                optionFields
              }
            </select>
          </div>
          <div className="full-toolbar-data">
            <label>Data Text:</label>
            <select value={this.props.selectedDataTextId} onChange={this.props.onChangeDataText}>
              {
                optionFields
              }
            </select>
          </div>
        </div>
        <div className="bc-toolbar-col-2">
          <HierNavButtonToolbar selectedChildViewId={this.props.selectedViewModel.id} disabled={this.props.needsSaving} />
          <Toolbar selectedViewModel={this.props.selectedViewModel} disabled={this.props.needsSaving} />
        </div>
      </div>
    );
  }
}

FullToolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  dataStores: PropTypes.array,
  onChangeDataStore: PropTypes.func,
  onChangeCollection: PropTypes.func,
  selectedDataStoreId: PropTypes.any,
  collections: PropTypes.array,
  selectedDataModelId: PropTypes.any,
  fields: PropTypes.array,
  selectedDataValueId: PropTypes.any,
  onChangeDataValue: PropTypes.func,
  selectedDataTextId: PropTypes.any,
  onChangeDataText: PropTypes.func,
  onClickSave: PropTypes.func,
  onClickRevert: PropTypes.func,
  elementId: PropTypes.string,
  onBlurName: PropTypes.func,
  onChangeElementId: PropTypes.func,
  toolbarDisabled: PropTypes.bool,
  needsSaving: PropTypes.bool
};

FullToolbar.contextTypes = { store: PropTypes.object };

const mapStateToProps = (state, ownProps) => {

  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  let selectedDataStoreId = ownProps.selectedViewModel.dataStoreId;
  selectedDataStoreId = (selectedDataStoreId !== null) ? selectedDataStoreId : DDL_UNSET;

  let selectedDataStore = DDL_UNSET;
  let selectedDataModelId = DDL_UNSET;
  let selectedDataValueId = DDL_UNSET;
  let selectedDataTextId = DDL_UNSET;
  let collections = [];
  let fields = [];
  if (selectedDataStoreId !== DDL_UNSET) {
    selectedDataStore = _.find(dataStores, { id: selectedDataStoreId });
    if (selectedDataStore) {
      collections = selectedDataStore.children;
    }
    selectedDataModelId = ownProps.selectedViewModel.dataModelId;

    const dataModel = _.find(collections, { id: selectedDataModelId });
    if (dataModel) {
      fields = dataModel.children;
    }
    selectedDataValueId = ownProps.selectedViewModel.dataValueId;
    selectedDataTextId = ownProps.selectedViewModel.dataTextId;
  }

  let elementId = ownProps.selectedViewModel.elementId;
  if (elementId === null) {
    elementId = ownProps.selectedViewModel.viewModel.elementId;
  }

  const result = {
    dataStores,
    selectedViewModel: ownProps.selectedViewModel,
    selectedDataStoreId,
    collections,
    selectedDataModelId,
    fields,
    selectedDataValueId,
    selectedDataTextId,
    elementId
  };

  const changeData = {
    elementId,
    selectedDataStoreId,
    selectedDataModelId,
    selectedDataValueId,
    selectedDataTextId
  };

  const needsSaving = getIsNeedsSaving(changeData, result);

  return Object.assign(result, { needsSaving, toolbarDisabled: needsSaving });
};

const isSaveButtonDisabled = (dispatch, ownProps, disabled) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.selectedViewModel.id, 'isSaveButtonDisabled', disabled, true));
};

const updateSelectChange = (dispatch, ownProps, event, propertyName) => {
  const viewModel = ownProps.selectedViewModel;

  dispatch(actionUpdateViewPropertyValue(viewModel.id, propertyName, parseInt(event.target.value, 10), true));
};

const update = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const viewModel = ownProps.selectedViewModel.viewModel;
    const model = graphTraversal.find(state.model, viewModel.id);
    const webPage = stateUtil.findAncestorByTypeLabel(state.model, model, ComponentTypes.WebPage);

    const isUnique = validationUtils.isUnique(webPage, model, 'elementId', ownProps.selectedViewModel.elementId);
    if (!isUnique) {
      dispatch(actionShowErrorModal('Select Field Error', 'Encountered an error trying to save the name value. The value in the \'name\' field is not unique within the webpage.', actionHideCurrentModal()));
    } else {
      viewModel.elementId = ownProps.selectedViewModel.elementId;
      viewModel.dataStoreId = ownProps.selectedViewModel.selectedDataStoreId;
      viewModel.dataModelId = ownProps.selectedViewModel.selectedDataModelId;
      viewModel.dataValueId = ownProps.selectedViewModel.selectedDataValueId;
      viewModel.dataTextId = ownProps.selectedViewModel.selectedDataTextId;

      const successCallback = () => {
        dispatch(actionPageDoesNotNeedSaving(ownProps.selectedViewModel.id));
        isSaveButtonDisabled(dispatch, ownProps, true);
      };

      viewModelCreator.update(dispatch, ownProps.selectedViewModel, successCallback);
    }
  };
};

const getOriginalModelFromViewModel = (state, selectViewModel) => {
  const viewModel = selectViewModel.viewModel;
  return graphTraversal.find(state.model, viewModel.id);
};

const revertChanges = (ownProps, event) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const model = getOriginalModelFromViewModel(state, selectViewModel);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'elementId', model.elementId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataStoreId', model.dataStoreId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataModelId', model.dataModelId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataValueId', model.dataValueId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataTextId', model.dataTextId, true));

    dispatch(actionPageDoesNotNeedSaving(ownProps.selectedViewModel.id));
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBlurName: () => {
      const viewModel = ownProps.selectedViewModel;

      if (viewModel.elementId !== viewModel.viewModel.elementId) {
        isSaveButtonDisabled(dispatch, ownProps, false);
      }
    },
    onChangeDataStore: (event) => {
      updateSelectChange(dispatch, ownProps, event, 'dataStoreId');
    },
    onChangeCollection: (event) => {
      updateSelectChange(dispatch, ownProps, event, 'dataModelId');
    },
    onChangeDataValue: (event) => {
      updateSelectChange(dispatch, ownProps, event, 'dataValueId');
    },
    onChangeDataText: (event) => {
      updateSelectChange(dispatch, ownProps, event, 'dataTextId');
    },
    onClickSave: () => {
      dispatch(update(ownProps));
    },
    onClickRevert: (event) => {
      dispatch(revertChanges(ownProps, event));
    },
    onChangeElementId: (event) => {
      // c.l(`event.target.value: ${event.target.value}`);
      // dispatch(updateElementId(ownProps, event.target.value));
      const vm = ownProps.selectedViewModel;
      const userSelectData = {
        elementId: event.target.value,
        selectedDataStoreId: vm.dataStoreId,
        selectedDataModelId: vm.dataModelId,
        selectedDataValueId: vm.dataValueId,
        selectedDataTextId: vm.dataTextId
      };

      c.l(`vm.dataStoreId: ${vm.dataStoreId}`);
      const needsSaving = getIsNeedsSaving(userSelectData, ownProps);

      c.lo(ownProps, 'ownProps: ');
      c.lo(userSelectData, 'userSelectData: ');

      c.l(`elementId: ${userSelectData.elementId}`);
      c.l(`NeedsSaving: ${needsSaving}`);

      if (needsSaving) {
        dispatch(actionPageNeedsSaving(vm.id));
      } else {
        dispatch(actionPageDoesNotNeedSaving(vm.id));
      }
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
