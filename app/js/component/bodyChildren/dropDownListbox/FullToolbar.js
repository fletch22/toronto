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

class FullToolbar extends React.Component {
  render() {
    const optionDataSources = this.props.dataStores.map((dataStore) => {
      return <option key={dataStore.id} value={dataStore.id} readOnly>{dataStore.label}</option>;
    });
    optionDataSources.unshift(<option key="select-one" value={-1} readOnly>(Select One)</option>);

    const optionCollections = this.props.collections.map((collection) => {
      return <option key={collection.id} value={collection.id} readOnly>{collection.label}</option>;
    });
    optionCollections.unshift(<option key="select-one" value={-1} readOnly>(Select One)</option>);

    const optionFields = this.props.fields.map((field) => {
      return <option key={field.id} value={field.id} readOnly>{field.label}</option>;
    });
    optionFields.unshift(<option key="select-one" value={-1} readOnly>(Select One)</option>);

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
            <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" disabled={this.props.isSaveButtonDisabled} />
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
          <HierNavButtonToolbar selectedChildViewId={this.props.selectedViewModel.id} />
          <Toolbar selectedViewModel={this.props.selectedViewModel} />
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
  isSaveButtonDisabled: PropTypes.bool,
  elementId: PropTypes.string,
  onBlurName: PropTypes.func,
  onChangeElementId: PropTypes.func
};

FullToolbar.contextTypes = { store: PropTypes.object };

const mapStateToProps = (state, ownProps) => {
  const UNSET = -1;
  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  let selectedDataStoreId = ownProps.selectedViewModel.dataStoreId;
  selectedDataStoreId = (selectedDataStoreId !== null) ? selectedDataStoreId : UNSET;

  let selectedDataStore = UNSET;
  let selectedDataModelId = UNSET;
  let selectedDataValueId = UNSET;
  let selectedDataTextId = UNSET;
  let collections = [];
  let fields = [];
  if (selectedDataStoreId !== UNSET) {
    selectedDataStore = _.find(dataStores, { id: selectedDataStoreId });
    if (selectedDataStore) {
      collections = selectedDataStore.children;
    }
    selectedDataModelId = ownProps.selectedViewModel.dataModelId;
    selectedDataModelId = (selectedDataModelId !== null) ? selectedDataModelId : UNSET;

    const dataModel = _.find(collections, { id: selectedDataModelId });
    if (dataModel) {
      fields = dataModel.children;
    }
    selectedDataValueId = ownProps.selectedViewModel.dataValueId;
    selectedDataValueId = (selectedDataValueId !== null) ? selectedDataValueId : UNSET;

    selectedDataTextId = ownProps.selectedViewModel.dataTextId;
    selectedDataTextId = (selectedDataTextId !== null) ? selectedDataTextId : UNSET;
  }

  let elementId = ownProps.selectedViewModel.elementId;
  if (elementId === null) {
    elementId = ownProps.selectedViewModel.viewModel.elementId;
  }

  return {
    dataStores,
    selectedViewModel: ownProps.selectedViewModel,
    selectedDataStoreId,
    collections,
    selectedDataModelId,
    fields,
    selectedDataValueId,
    selectedDataTextId,
    isSaveButtonDisabled: ownProps.selectedViewModel.isSaveButtonDisabled,
    elementId
  };
};

const isSaveButtonDisabled = (dispatch, ownProps, disabled) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.selectedViewModel.id, 'isSaveButtonDisabled', disabled, true));
};

const updateSelectChange = (dispatch, ownProps, event, propertyName) => {
  const viewModel = ownProps.selectedViewModel;
  dispatch(actionUpdateViewPropertyValue(viewModel.id, propertyName, parseInt(event.target.value, 10), true));
  isSaveButtonDisabled(dispatch, ownProps, false);
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
      viewModel.dataStoreId = ownProps.selectedViewModel.dataStoreId;
      viewModel.dataModelId = ownProps.selectedViewModel.dataModelId;
      viewModel.dataValueId = ownProps.selectedViewModel.dataValueId;

      const successCallback = () => {
        dispatch(actionPageDoesNotNeedSaving(ownProps.selectedViewModel.id));
        isSaveButtonDisabled(dispatch, ownProps, true);
      };

      viewModelCreator.update(dispatch, ownProps.selectedViewModel, successCallback);
    }
  };
};

const revertChanges = (ownProps, event) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    const model = graphTraversal.find(state.model, viewModel.id);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'elementId', model.elementId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataStoreId', model.dataStoreId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataModelId', model.dataModelId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataValueId', model.dataValueId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataTextId', model.dataTextId, true));
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
    onChangeElementId: () => {
      dispatch(actionPageNeedsSaving(ownProps.selectedViewModel.id));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
