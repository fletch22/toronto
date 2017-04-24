import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import { actionShowModelData } from '../../../../../actions/wizard/configureDdl/';
import Grid from '../../../../editors/grid/Grid';
import collectionService from '../../../../../service/CollectionService';
import collectionToGridDataTransformer from '../../../../../domain/CollectionToGridDataTransformer';

class CreateCollectionView extends React.Component {

  componentDidUpdate() {
    const collectionId = this.props.wizardData.selectedCollectionId;

    const self = this;

    if (this.props.isSlideActive && this.props.needsToMakeDataRequest) {
      c.l('Requesting data for grid...');
      collectionService.get(collectionId).then((result) => {
        let data = collectionToGridDataTransformer.transform(result);
        c.lo(data);

        data = [
          {
            name: 'Michael Jordan',
            position: 'Shooting Guard'
          },
          {
            name: 'Charles Barkley',
            position: 'Power Forward'
          }
        ];

        const props = self.props;
        const dispatch = props.dispatch;
        dispatch(actionShowModelData(props.wizardData.id, data));
      });
    }
  }

  render() {
    let _rows = [];
    let _columns = [];

    const createRows = function () {
      const rows = [];
      for (let i = 1; i < 1000; i++) {
        rows.push({
          id: i,
          title: `Title ${i}`,
          count: i * 1000
        });
      }

      _rows = rows;
    };

    const getInitialState = function () {
      createRows();
      _columns = [
        { key: 'id', name: 'ID' },
        { key: 'title', name: 'Title' },
        { key: 'count', name: 'Count' }
      ];

      return null;
    };

    getInitialState();

    return (
      <div className="wizard-config-ddl">
        <div className="wizard-config-ddl col-md-12">
          <div className="row" style={{ height: '90%' }}>
            <Grid viewId={this.props.gridView.id} columns={_columns} rows={_rows} />
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
  pageData: PropTypes.array,
  needsToMakeDataRequest: PropTypes.bool,
  gridView: PropTypes.object
};

const partialFlatten = (ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.createCollection;

  // ownProps.foo = 'cherry';
  // const collections = wizardData.viewModel.viewModel.children;
  // const collection = _.find(collections, (coll) => {
  //   return coll.viewModel.id === wizardData.selectedCollectionId;
  // });
  //
  // let collectionFields = [];
  // if (collection) {
  //   collectionFields = collection.viewModel.children;
  // }
  // c.lo(slide.pageData, 'pageData: ');

  c.l(slide.needsToMakeDataRequest);

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    createCollection: slide,
    isSlideActive: ownProps.isSlideActive,
    pageData: slide.gridView.pageData,
    needsToMakeDataRequest: slide.needsToMakeDataRequest,
    gridView: slide.gridView
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
