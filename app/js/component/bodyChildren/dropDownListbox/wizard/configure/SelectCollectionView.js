import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { DatastoreModelConstants } from '../../../../../domain/component/datastoreModelFactory';
import SelectCollectionToolbar from './selectCollection/toolbar/SelectCollectionToolbar';

class SelectCollectionView extends React.Component {

  render() {
    // Get AppContainer's Default

    let choices = [
      {},
      {},{},
      {},{},
      {},{},
      {},{},
      {},{},
      {},{},
      {},{},
      {},{},
      {},
    ];

    // const defaultDatastore = _.filter(this.props.datastores, (datastore) => (datastore.label === DatastoreModelConstants.DEFAULT_DATASTORE_LABEL));
    //
    // c.lo(defaultDatastore);
    //
    // let choicess = defaultDatastore[0].children;

    c.lo(choices);

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        const classes = 'list-group-item list-group-item-action';
        return (<a href="#" key={index} className={classes} data-value={index}>
          {index}
        </a>);
      });
    } else {
      choices = (
        <div style={{ padding: '10px 0 0 30px' }}>(no collections)</div>
      );
    }

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <label>Select collection:</label>
          <div className="list-group" style={{ overflowY: 'scroll', maxWidth: '98%', minHeight: '200px', maxHeight: '300px' }}>
            {
              choices
            }
          </div>
          <div className="sel_view_row_toolbar" style={{ minHeight: '90px' }}>
            <div style={{ height: '50x' }}>
              <SelectCollectionToolbar onClickAddCollection={this.props.onClickAddCollection} />
            </div>
          </div>
        </div>
        <div className="sel_view_row_foot_name">
          <ButtonWizard viewId={this.props.viewId} jumpToView={WizardPages.SELECT_DDL_FIELDS} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectCollectionView.propTypes = {
  viewId: PropTypes.string,
  buttonNextDisabled: PropTypes.bool,
  datastores: PropTypes.array,
  onClickAddCollection: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddCollection: () => {
      c.l('Clicked add collection...');
    }
  };
};

SelectCollectionView = connect(
  null,
  mapDispatchToProps
)(SelectCollectionView);

export default SelectCollectionView;
