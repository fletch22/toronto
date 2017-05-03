import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import { actionShowModelData } from '../../../../../actions/wizard/configureDdl/';
import Grid from '../../../../editors/grid/Grid';
import collectionService from '../../../../../service/collectionService';
import collectionToGridDataTransformer from '../../../../../domain/collection/CollectionToGridDataTransformer';

class CreateCollectionView extends React.Component {

  componentDidUpdate() {
    const collectionId = this.props.wizardData.selectedCollectionId;
    const self = this;

    if (this.props.isSlideActive && this.props.needsToMakeDataRequest) {
      collectionService.get(collectionId).then((result) => {
        const data = collectionToGridDataTransformer.transform(result);

        const props = self.props;
        const dispatch = props.dispatch;
        dispatch(actionShowModelData(props.wizardData.id, data));
      });
    }
  }

  render() {
    return (
      <div className="wizard-config-ddl">
        <div className="wizard-config-ddl col-md-12">
          <div className="row" style={{ height: '90%' }}>
            <Grid gridViewModel={this.props.gridViewModel} />
          </div>
          <div className="sel_view_row_foot_name text-right">
            <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_DDL_FIELDS} label="Back" />
            <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.CREATE_COLLECTION} disabled={this.props.buttonNextDisabled} label="Next" />
          </div>
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
  gridViewModel: PropTypes.object
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
    gridViewModel: slide.gridView
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
