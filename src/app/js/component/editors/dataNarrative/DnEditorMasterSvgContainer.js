import React, { PropTypes } from 'react';
import dimensions from 'react-dimensions';
import DnEditorMasterSvgRoot from './DnEditorMasterSvgRoot';
import CollectionMenu from './CollectionMenu';
import { connect } from 'react-redux';

class DnEditorMasterSvgContainer extends React.Component {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <DnEditorMasterSvgRoot data={this.props.data} height={this.props.containerHeight} width={this.props.containerWidth} size={[500, 500]} />
      </div>
    );
  }
}

DnEditorMasterSvgContainer.propTypes = {
  data: PropTypes.object,
  containerHeight: PropTypes.any,
  containerWidth: PropTypes.any,
  collectionMenu: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    data: ownProps.data,
    collectionMenu: ownProps.data.collectionMenu
  };
};

DnEditorMasterSvgContainer = connect(
  mapStateToProps,
  null
)(DnEditorMasterSvgContainer);

DnEditorMasterSvgContainer = dimensions()(DnEditorMasterSvgContainer);

export default DnEditorMasterSvgContainer;
