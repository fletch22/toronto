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
import { actionPageDoesNotNeedSaving } from '../../../actions/bodyChildrenEditor/index';
import validationUtils from '../../../util/validationUtil';
import Button from '../../../component/bodyChildren/toolbar/Button';
import stateUtil from '../../../util/stateUtil';
import graphTraversal from '../../../state/graphTraversal';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import ActionRegistration from '../../../actions/ActionRegistration';
import f22Uuid from '../../../util/f22Uuid';
import stateFixer from '../../../domain/stateFixer';
import actionBodyChildSelectorHandler from '../../../reducers/actionBodyChildSelectorHandler';

const DDL_UNSET = -1;

const getIsNeedsSaving = (userSelectData, data) => {
  const innerViewModel = data.selectedViewModel.viewModel;

  return userSelectData.elementId !== innerViewModel.elementId
    || userSelectData.selectedDataStoreId !== innerViewModel.dataStoreId
    || userSelectData.selectedDataModelId !== innerViewModel.dataModelId
    || userSelectData.selectedDataValueId !== innerViewModel.dataValueId
    || userSelectData.selectedDataTextId !== innerViewModel.dataTextId;
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
                persistState={false} onChangeExternal={this.props.onChangeElementId}
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
  onChangeElementId: PropTypes.func,
  toolbarDisabled: PropTypes.bool,
  needsSaving: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {

  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  const selectedDataStoreId = !!ownProps.selectedViewModel.dataStoreId ? ownProps.selectedViewModel.dataStoreId : DDL_UNSET;

  let selectedDataModelId = DDL_UNSET;
  let selectedDataValueId = DDL_UNSET;
  let selectedDataTextId = DDL_UNSET;
  let collections = [];
  let fields = [];
  if (selectedDataStoreId !== DDL_UNSET) {
    const selectedDataStore = _.find(dataStores, { id: selectedDataStoreId });
    if (selectedDataStore) {
      collections = selectedDataStore.children;
    }
    selectedDataModelId = !!ownProps.selectedViewModel.dataModelId ? ownProps.selectedViewModel.dataModelId : DDL_UNSET;

    const dataModel = _.find(collections, { id: selectedDataModelId });
    if (dataModel) {
      fields = dataModel.children;
    }

    if (selectedDataModelId !== DDL_UNSET) {
      selectedDataValueId = !!ownProps.selectedViewModel.dataValueId ? ownProps.selectedViewModel.dataValueId : DDL_UNSET;
      selectedDataTextId = !!ownProps.selectedViewModel.dataTextId ? ownProps.selectedViewModel.dataTextId : DDL_UNSET;
    }
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

const getOriginalModelFromViewModel = (state, selectViewModel) => {
  const viewModel = selectViewModel.viewModel;
  return graphTraversal.find(state.model, viewModel.id);
};

const COMPONENT_KEY = f22Uuid.generate();
const UPDATE_SELECT_CHANGE = `${COMPONENT_KEY}-UPDATE_SELECT_CHANGE`;
const fn = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;
  const view = graphTraversal.find(stateNew, args.viewId);

  view[args.propertyName] = args.newValue;

  const pageAndSelected = actionBodyChildSelectorHandler.getPageViewModelAndSelectedViewModel(stateNew, args.viewId);
  pageAndSelected.pageViewModel.needsSaving = args.needsSaving;

  stateFixer.fix(actionStatePackage.jsonStateOld, JSON.stringify(stateNew));

  return stateNew;
};
ActionRegistration.register(UPDATE_SELECT_CHANGE, fn);

const updateSelectChange = (ownProps, newSelection, propertyName) => {
  return (dispatch, getState) => {
    const state = getState();

    const mergedProps = _.cloneDeep(ownProps);
    mergedProps.selectedViewModel[propertyName] = newSelection;

    const props = mapStateToProps(state, mergedProps);

    ActionRegistration.invoke(dispatch, UPDATE_SELECT_CHANGE, { viewId: ownProps.selectedViewModel.id, propertyName, newValue: parseInt(newSelection, 10), needsSaving: props.needsSaving });
  };
};

const save = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const props = mapStateToProps(state, ownProps);

    if (props.needsSaving) {
      const viewModel = props.selectedViewModel.viewModel;
      const model = graphTraversal.find(state.model, viewModel.id);
      const webPage = stateUtil.findAncestorByTypeLabel(state.model, model, ComponentTypes.WebPage);

      const isUnique = validationUtils.isUnique(webPage, model, 'elementId', props.selectedViewModel.elementId);
      if (!isUnique) {
        dispatch(actionShowErrorModal('Select Field Error', 'Encountered an error trying to save the name value. The value in the \'name\' field is not unique within the webpage.', actionHideCurrentModal()));
      } else {
        viewModel.elementId = props.elementId;
        viewModel.dataStoreId = props.selectedDataStoreId;
        viewModel.dataModelId = props.selectedDataModelId;
        viewModel.dataValueId = props.selectedDataValueId;
        viewModel.dataTextId = props.selectedDataTextId;

        const setPageDoesNotNeedSaving = (stateThing) => {
          const pageAndSelected = actionBodyChildSelectorHandler.getPageViewModelAndSelectedViewModel(stateThing, props.selectedViewModel.id);
          pageAndSelected.pageViewModel.needsSaving = false;
        };

        viewModelCreator.update(dispatch, props.selectedViewModel, undefined, setPageDoesNotNeedSaving);
      }
    }
  };
};

const revertChanges = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const model = getOriginalModelFromViewModel(state, selectViewModel);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'elementId', model.elementId, false));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataStoreId', model.dataStoreId, false));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataModelId', model.dataModelId, false));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataValueId', model.dataValueId, false));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'dataTextId', model.dataTextId, false));

    dispatch(actionPageDoesNotNeedSaving(ownProps.selectedViewModel.id));
  };
};

const changeElementId = (ownProps, newElementId) => {
  return (dispatch, getState) => {
    const state = getState();

    let props = _.cloneDeep(ownProps);
    props.elementId = newElementId;
    props = mapStateToProps(state, ownProps);

    if (props.needsSaving) {
      dispatch(actionUpdateViewPropertyValue(props.selectedViewModel.id, 'elementId', newElementId, true));
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeDataStore: (event) => {
      const newSelection = event.target.value;
      dispatch(updateSelectChange(ownProps, newSelection, 'dataStoreId'));
    },
    onChangeCollection: (event) => {
      const newSelection = event.target.value;
      dispatch(updateSelectChange(ownProps, newSelection, 'dataModelId'));
    },
    onChangeDataValue: (event) => {
      const newSelection = event.target.value;
      dispatch(updateSelectChange(ownProps, newSelection, 'dataValueId'));
    },
    onChangeDataText: (event) => {
      const newSelection = event.target.value;
      dispatch(updateSelectChange(ownProps, newSelection, 'dataTextId'));
    },
    onClickSave: () => {
      dispatch(save(ownProps));
    },
    onClickRevert: () => {
      dispatch(revertChanges(ownProps));
    },
    onChangeElementId: (event) => {
      dispatch(changeElementId(ownProps, event.target.value));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;
