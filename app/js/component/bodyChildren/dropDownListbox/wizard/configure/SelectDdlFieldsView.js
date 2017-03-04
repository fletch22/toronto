import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';

class SelectCollectionView extends React.Component {

  render() {
    return (
      <div className="wizard-config-ddl">
        <div className="wizard-config-ddl col-md-12">
          <div className="row" style={{ height: '90%' }}>

          </div>
          <div className="row text-right">
            <ButtonWizard viewId={this.props.viewId} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
          </div>
        </div>
      </div>
    );
  }
}

SelectCollectionView.propTypes = {
  viewId: PropTypes.string
};

export default SelectCollectionView;
