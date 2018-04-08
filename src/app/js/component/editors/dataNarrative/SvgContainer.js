import React, { PropTypes } from 'react';
import dimensions from 'react-dimensions';
import SvgRoot from './SvgRoot';
import CollectionMenu from './CollectionMenu';
import { connect } from 'react-redux';

class SvgContainer extends React.Component {
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <SvgRoot data={this.props.data} height={this.props.containerHeight} width={this.props.containerWidth} size={[500, 500]} />
      </div>
    );
  }
}

SvgContainer.propTypes = {
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

SvgContainer = connect(
  mapStateToProps,
  null
)(SvgContainer);

SvgContainer = dimensions()(SvgContainer);

export default SvgContainer;
