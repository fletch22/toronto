import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionShowModelData } from '../../../actions/grid/index';
import Grid from './Grid';
import collectionService from '../../../service/collectionService';
import collectionToGridDataTransformer from '../../../domain/collection/collectionToGridDataTransformer';

class OrbGrid extends React.Component {

  componentDidUpdate() {
    const self = this;
    if (this.props.needsToMakeDataRequest && !!this.props.collectionId && this.props.collectionId !== -1) {
      collectionService.get(this.props.collectionId).then((result) => {
        const data = collectionToGridDataTransformer.transform(result);

        const props = self.props;
        const dispatch = props.dispatch;
        dispatch(actionShowModelData(props.gridViewModel.id, data));
      });
    }
  }

  render() {
    return (
      <Grid collectionId={this.props.collectionId} gridViewModel={this.props.gridViewModel} />
    );
  }
}

OrbGrid.propTypes = {
  gridViewModel: PropTypes.object,
  collectionId: PropTypes.any,
  needsToMakeDataRequest: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    gridViewModel: ownProps.gridViewModel,
    collectionId: ownProps.gridViewModel.data.collectionId,
    needsToMakeDataRequest: ownProps.gridViewModel.needsToMakeDataRequest
  };
};

OrbGrid = connect(
  mapStateToProps,
  null
)(OrbGrid);

export default OrbGrid;
