import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import { actionShowModelData } from '../../../../../actions/grid/index';
import Grid from '../../../../editors/grid/Grid';
import collectionService from '../../../../../service/collectionService';
import collectionToGridDataTransformer from '../../../../../domain/collection/collectionToGridDataTransformer';
import DataModelGrid from '../../../../editors/grid/DataModelGrid';

class CreateCollectionView extends React.Component {

  componentDidUpdate() {
    const self = this;

    if (this.props.isSlideActive && this.props.needsToMakeDataRequest) {
      collectionService.get(self.props.gridViewModel.data.collectionId).then((result) => {
        const data = collectionToGridDataTransformer.transform(result);

        const props = self.props;
        const dispatch = props.dispatch;
        dispatch(actionShowModelData(props.gridViewModel.id, data));
      });
    }
  }

  render() {
    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <DataModelGrid dataModelId={this.props.selectedDataModelId} gridViewModel={this.props.gridViewModel} />
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_DDL_FIELDS} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SAVE_DDL_INFO} label="Next" />
        </div>
      </div>
    );
  }
}

CreateCollectionView.propTypes = {
  wizardData: PropTypes.object,
  isSlideActive: PropTypes.bool,
  buttonNextDisabled: PropTypes.bool,
  createCollection: PropTypes.object,
  needsToMakeDataRequest: PropTypes.bool,
  gridViewModel: PropTypes.object,
  selectedDataModelId: PropTypes.any
};

const partialFlatten = (ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.createCollection;

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    createCollection: slide,
    isSlideActive: ownProps.isSlideActive,
    needsToMakeDataRequest: slide.gridView.needsToMakeDataRequest,
    gridViewModel: slide.gridView,
    selectedDataModelId: wizardData.selectedDataModelId
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

CreateCollectionView = connect(
  mapStateToProps,
  null
)(CreateCollectionView);


export default CreateCollectionView;
