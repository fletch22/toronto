import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import dataUniverseModelUtils from '../../../domain/component/DataUniverseModelUtils';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import _ from 'lodash';
import viewModelCreator from '../../../component/utils/viewModelCreator';

class FullToolbar extends React.Component {

  // componentDidUpdate() {
  //   if (this.props.dataModelId !== null) {
  //     gridService.lookupCollectionIdFromDataModelId(this.props.dataModelId)
  //       .then((result) => {
  //         const collectionId = result.collectionId;
  //         this.props.onCollectionLookupComplete(collectionId);
  //       });
  //   }
  // }

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
            This is a drop down listbox.
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
  onChangeDataText: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const UNSET = -1;
  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataUniverseModelUtils.getDatastoresFromDataUniverse(dataUniverse);
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

    c.lo(dataModel, 'dataModel: ');
  }

  return {
    dataStores,
    selectedViewModel: ownProps.selectedViewModel,
    selectedDataStoreId,
    collections,
    selectedDataModelId,
    fields,
    selectedDataValueId,
    selectedDataTextId
  };
};

const updateViewModelField = (dispatch, ownProps, event, propertyName) => {
  const viewModel = ownProps.selectedViewModel.viewModel;
  viewModel[propertyName] = parseInt(event.target.value, 10);
  viewModelCreator.update(dispatch, ownProps.selectedViewModel, null);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeDataStore: (event) => {
      updateViewModelField(dispatch, ownProps, event, 'dataStoreId');
    },
    onChangeCollection: (event) => {
      updateViewModelField(dispatch, ownProps, event, 'dataModelId');
    },
    onChangeDataValue: (event) => {
      updateViewModelField(dispatch, ownProps, event, 'dataValueId');
    },
    onChangeDataText: (event) => {
      updateViewModelField(dispatch, ownProps, event, 'dataTextId');
    }
  };
};
FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
