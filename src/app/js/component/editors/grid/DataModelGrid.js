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

  componentDidUpdate(prevProps) {
    if (prevProps.dataModelId !== this.props.dataModelId) {
      this.updateGrid();
    }
  }

  updateGrid() {
    if (this.props.dataModelId !== null) {
      gridService.lookupCollectionIdFromDataModelId(this.props.dataModelId)
        .then((result) => {
          const collectionId = result.collectionId;
          this.context.store.dispatch(actionSetCollectionId(this.props.gridViewModel.id, collectionId));
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
};

DataModelGrid.contextTypes = { store: PropTypes.object };

const mapStateToProps = (state, ownProps) => {
  return {
    gridViewModel: ownProps.gridViewModel,
    dataModelId: ownProps.dataModelId,
    collectionId: ownProps.gridViewModel.collectionId
  };
};

DataModelGrid = connect(
  mapStateToProps,
  null
)(DataModelGrid);

export default DataModelGrid;
