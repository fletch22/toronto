import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import dataUniverseModelUtils from '../../../domain/component/dataUniverseModelUtils';
import dataStoreModelUtils from '../../../domain/component/dataStoreModelUtils';
import _ from 'lodash';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import PropPathTextInput from '../../editors/PropPathTextInput';
import { actionShowErrorModal, actionHideCurrentModal } from '../../../actions/index';
import validationUtils from '../../../util/validationUtil';
import Button from '../../../component/bodyChildren/toolbar/Button';
import stateUtil from '../../../util/stateUtil';
import graphTraversal from '../../../state/graphTraversal';
import ComponentTypes from '../../../domain/component/ComponentTypes';

class FullToolbar extends React.Component {
  render() {
    const optionDataSources = this.props.dataStores.map((dataStore) => {
      return <option key={dataStore.id} value={dataStore.id}>{dataStore.label}</option>;
    });
    optionDataSources.unshift(<option key="select-one" value={-1}>(Select One)</option>);

    const optionCollections = this.props.collections.map((collection) => {
      return <option key={collection.id} value={collection.id}>{collection.label}</option>;
    });
    optionCollections.unshift(<option key="select-one" value={-1}>(Select One)</option>);

    const optionFields = this.props.fields.map((field) => {
      return <option key={field.id} value={field.id}>{field.label}</option>;
    });
    optionFields.unshift(<option key="select-one" value={-1}>(Select One)</option>);

    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div className="bc-toolbar-title-label">
            { this.props.selectedViewModel.viewModel.typeLabel }
          </div>
          <div className="bc-toolbar-description">
            This is a select component.
          </div>
          <div className="full-toolbar-data" style={{ display: 'flex' }}>
            <div>
              <label>Name:</label>
            </div>
            <div>
              <PropPathTextInput id={this.props.selectedViewModel.id} path="elementId" value={this.props.elementId} persistState={false} />
            </div>
            <div>
              <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" />
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
  isSaveNameButtonDisabled: PropTypes.bool,
  elementId: PropTypes.string
};

FullToolbar.contextTypes = { store: PropTypes.object };

const mapStateToProps = (state, ownProps) => {
  const UNSET = -1;
  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  let selectedDataStoreId = ownProps.selectedViewModel.viewModel.dataStoreId;
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
    selectedDataModelId = ownProps.selectedViewModel.viewModel.dataModelId;
    selectedDataModelId = (selectedDataModelId !== null) ? selectedDataModelId : UNSET;

    const dataModel = _.find(collections, { id: selectedDataModelId });
    if (dataModel) {
      fields = dataModel.children;
    }
    selectedDataValueId = ownProps.selectedViewModel.viewModel.dataValueId;
    selectedDataValueId = (selectedDataValueId !== null) ? selectedDataValueId : UNSET;

    selectedDataTextId = ownProps.selectedViewModel.viewModel.dataTextId;
    selectedDataTextId = (selectedDataTextId !== null) ? selectedDataTextId : UNSET;
  }

  // c.lo(ownProps.selectedViewModel, 'ownProps.selectedViewModel: ');

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
    isSaveNameButtonDisabled: ownProps.selectedViewModel.isSaveNameButtonDisabled,
    elementId
  };
};

const updateSelectChange = (dispatch, ownProps, event, propertyName) => {
  const viewModel = ownProps.selectedViewModel.viewModel;
  viewModel[propertyName] = parseInt(event.target.value, 10);
  viewModelCreator.update(dispatch, ownProps.selectedViewModel, null);
};

const updateNameChange = (ownProps, event) => {
  return (dispatch, getState) => {
    const state = getState();

    const viewModel = ownProps.selectedViewModel.viewModel;

    // c.l(`updateNameChange: ${ownProps.selectedViewModel.elementId}`);
    // c.lo(ownProps.selectedViewModel, 'vm: ');

    // const elementId = event.target.value;

    const model = graphTraversal.find(state.model, viewModel.id);

    const webPage = stateUtil.findAncestorByTypeLabel(state.model, model, ComponentTypes.WebPage);

    // c.l(`viewModel.elementId: ${viewModel.elementId}`);
    // c.l(`ownProps.selectedViewModel.elementId: ${ownProps.selectedViewModel.elementId}`);

    const isUnique = validationUtils.isUnique(webPage, model, 'elementId', ownProps.selectedViewModel.elementId);
    if (!isUnique) {
      dispatch(actionShowErrorModal('Select Field Error', 'Encountered an error trying to save the name value. The value in the \'name\' field is not unique within the webpage.', actionHideCurrentModal()));
    } else {
      viewModel.elementId = ownProps.selectedViewModel.elementId;
      viewModelCreator.update(dispatch, ownProps.selectedViewModel, null);
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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
    onClickSave: (event) => {
      dispatch(updateNameChange(ownProps, event));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
