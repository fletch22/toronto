import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import F22Input from '../../../../../component/editors/F22Input';

class CreateCollectionView extends React.Component {

  render() {
    return (
      <div className="wizard-config-ddl">
        <div className="wizard-config-ddl col-md-12">
          <div className="row" style={{ height: '90%' }}>
            <F22Input />
          </div>
          <div className="row text-right">
            <ButtonWizard viewId={this.props.viewId} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
            <button className="btn btn-default">Save</button>
          </div>
        </div>
      </div>
    );
  }
}

CreateCollectionView.propTypes = {
  viewId: PropTypes.string
};

export default CreateCollectionView;
