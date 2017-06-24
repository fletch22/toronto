import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import OrbGrid from './OrbGrid';
import { actionSetCollectionId } from '../../../actions/grid/index';
import gridService from '../../../service/gridService';
import { GridViewModelConstants } from '../../../domain/collection/gridViewModelFactory';

class DataModelGrid extends React.Component {

  componentDidMount() {
    this.updateGrid();
  }

  componentDidUpdate() {
    this.updateGrid();
  }

  updateGrid() {
    if (this.props.dataModelId !== null) {
      gridService.lookupCollectionIdFromDataModelId(this.props.dataModelId)
        .then((result) => {
          const collectionId = result.collectionId;
          this.props.onCollectionLookupComplete(collectionId);
        });
    }
  }

  render() {
    let grid = null;
    if (this.props.collectionId !== GridViewModelConstants.COLLECTION_ID_UNSET) {
      grid = (<OrbGrid collectionId={this.props.collectionId} gridViewModel={this.props.gridViewModel} />);
    }

    return (
      <div>
        {
          grid
        }
      </div>
    );
  }
}

DataModelGrid.propTypes = {
  gridViewModel: PropTypes.object,
  dataModelId: PropTypes.any,
  collectionId: PropTypes.any,
  onCollectionLookupComplete: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  // c.lo(ownProps.gridViewModel, 'ownProps.gridViewModel: ');

  return {
    gridViewModel: ownProps.gridViewModel,
    dataModelId: ownProps.dataModelId,
    collectionId: ownProps.gridViewModel.collectionId
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollectionLookupComplete: (collectionId) => {
      dispatch(actionSetCollectionId(ownProps.gridViewModel.id, collectionId));
    }
  };
};

DataModelGrid = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataModelGrid);

export default DataModelGrid;
