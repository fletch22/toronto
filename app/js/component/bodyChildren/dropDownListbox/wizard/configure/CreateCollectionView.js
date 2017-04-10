import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import ModelPropTextInput from '../../../../editors/ModelPropTextInput';
import { connect } from 'react-redux';

class CreateCollectionView extends React.Component {

  render() {
    return (
      <div className="wizard-config-ddl">
        <div className="wizard-config-ddl col-md-12">
          <div className="row" style={{ height: '90%' }}>
            Task: <br />
            <ol>
              <li>Get dataset if it exists</li>
              <li>If it doesn't exist make the data.</li>
              <li>Display the grid of data (even if empty)</li>
              <li>Add row functionality.</li>
              <li>Add in-row update functionality.</li>
            </ol>
          </div>
          <div className="sel_view_row_foot_name text-right">
            <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
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
  createCollection: PropTypes.object
};

const partialFlatten = (ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.createCollection;

  // const collections = wizardData.viewModel.viewModel.children;
  // const collection = _.find(collections, (coll) => {
  //   return coll.viewModel.id === wizardData.selectedCollectionId;
  // });
  //
  // let collectionFields = [];
  // if (collection) {
  //   collectionFields = collection.viewModel.children;
  // }

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    createCollection: slide
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
