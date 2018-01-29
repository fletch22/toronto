import React, { PropTypes } from 'react';
import WizardPages from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
// import { actionShowModelData } from '../../../../../../actions/grid/index';
// import collectionService from '../../../../../../service/collectionService';
// import collectionToGridDataTransformer from '../../../../../../domain/collection/collectionToGridDataTransformer';
import DataModelGrid from '../../../../../editors/grid/DataModelGrid';
import graphTraversal from '../../../../../../../../common/state/graphTraversal';
import collectionToGridDataTransformer from '../../../../../../domain/collection/collectionToGridDataTransformer';

class SlideCollectionGrid extends React.Component {

  // componentDidUpdate(prevProps) {
  //   const self = this;
  //
  //   if (prevProps.isSlideActive !== this.props.isSlideActive
  //     || prevProps.needsToMakeDataRequest !== this.props.needsToMakeDataRequest
  //     || prevProps.collectionId !== this.props.collectionId) {
  //     if (this.props.isSlideActive && this.props.needsToMakeDataRequest) {
  //       // c.lo(self.props.wizardData, 'self.props: ');
  //       collectionService.get(self.props.collectionId).then((result) => {
  //         const data = collectionToGridDataTransformer.transform(result);
  //
  //         const props = self.props;
  //         const dispatch = props.dispatch;
  //         dispatch(actionShowModelData(props.gridViewModel.id, data));
  //       });
  //     }
  //   }
  // }

  render() {
    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <DataModelGrid dataModelId={this.props.dataModelId} gridViewModel={this.props.wizardData.slides.createCollection.gridView} />
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_FIELDS} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SAVE_DDL_INFO} label="Next" />
        </div>
      </div>
    );
  }
}

SlideCollectionGrid.propTypes = {
  wizardData: PropTypes.object,
  isSlideActive: PropTypes.bool,
  buttonNextDisabled: PropTypes.bool,
  createCollection: PropTypes.object,
  needsToMakeDataRequest: PropTypes.bool,
  gridViewModel: PropTypes.object,
  dataModelId: PropTypes.any,
  collectionId: PropTypes.any
};

const partialFlatten = (state, ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.createCollection;

  if (!!wizardData.dataModelId && wizardData.dataModelId !== -1) {
    const dataModel = graphTraversal.find(state.model, wizardData.dataModelId);
    c.lo(dataModel, 'dataModel in pf: ');

    const gridModelData = collectionToGridDataTransformer.transform(dataModel);
    // c.lo(gridModelData, 'gridModelData: ');
    // c.lo(gridModelData, 'gridModelData: ');
    // c.lo(wizardData.dataModelId, 'wizardData.dataModelId: ');

    // slide.gridView.data = gridModelData;
    slide.gridView.data.collectionId = gridModelData.collectionId;
    slide.gridView.data.rows = gridModelData.rows;
    slide.gridView.data.columns = gridModelData.columns;
  } else {
    slide.gridView.data.collectionId = wizardData.dataModelId;
  }

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    createCollection: slide,
    isSlideActive: ownProps.isSlideActive,
    needsToMakeDataRequest: slide.gridView.needsToMakeDataRequest,
    gridViewModel: slide.gridView,
    dataModelId: wizardData.dataModelId,
    collectionId: wizardData.dataModelId
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(state, ownProps);
};

SlideCollectionGrid = connect(
  mapStateToProps,
  null
)(SlideCollectionGrid);


export default SlideCollectionGrid;
