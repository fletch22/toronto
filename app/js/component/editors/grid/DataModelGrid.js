import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid from './Grid';
import { actionSetCollectionId } from '../../../actions/grid/index';
import gridService from '../../../service/gridService';

class DataModelGrid extends React.Component {

  componentDidUpdate() {
    // Async fetch to get dataModel's associated UserData table
    c.l('about to call lookup');
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
    if (this.props.collectionId !== -1) {
      grid = (<Grid collectionId={this.props.collectionId} gridViewModel={this.props.gridViewModel} />);
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
  return {
    gridViewModel: ownProps.gridViewModel,
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
