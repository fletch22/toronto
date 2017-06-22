import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import dataUniverseModelUtils from '../../../domain/component/DataUniverseModelUtils';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
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

    optionDataSources.unshift(<option key="select-one" value="">(Select One)</option>);

    const selectedDataStoreId = (this.props.selectedDataStoreId !== null) ? this.props.selectedDataStoreId : -1;

    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div className="bc-toolbar-title-label">
            { this.props.selectedViewModel.viewModel.typeLabel }
          </div>
          <div className="bc-toolbar-description">
            This is a drop down listbox.
          </div>
          <div className="full-toolbar-datasources">
            <label>DataStore:</label>
            <select value={selectedDataStoreId} onChange={this.props.onChangeDataStore}>
              {
                optionDataSources
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
  selectedDataStoreId: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataUniverseModelUtils.getDatastoresFromDataUniverse(dataUniverse);

  return {
    dataStores,
    selectedViewModel: ownProps.selectedViewModel,
    selectedDataStoreId: ownProps.selectedViewModel.viewModel.dataStoreId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeDataStore: (event) => {
      const viewModel = ownProps.selectedViewModel.viewModel;
      viewModel.dataStoreId = event.target.value;
      viewModelCreator.update(dispatch, ownProps.selectedViewModel, null);
    }
  };
};
FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
