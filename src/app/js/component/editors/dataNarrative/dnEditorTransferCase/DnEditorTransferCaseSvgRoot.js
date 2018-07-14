import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });

// import SvgRootVisualization from './SvgRootVisualization';
import { actionSetDataNarrativeViewProps } from '../../../../actions/bodyChildrenEditor/index';
import DnComponentDealer from '../DnComponentDealer';
import SvgComponent from '../SvgComponent';

class DnEditorTransferCaseSvgRoot extends React.Component {
  render() {
    return (
      <svg id="svgRoot" width={this.props.width} height={this.props.height + 10} style={{ border: '1px solid gray' }}>
        <g ref="outerRootGroup">
          <g ref="rootGroup">

          </g>
        </g>
      </svg>
    );
  }
}

DnEditorTransferCaseSvgRoot.propTypes = {
  height: PropTypes.any,
  width: PropTypes.any,
  data: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {

  // c.lo(ownProps);

  return {
    zoom: ownProps.data.viewModel.zoom
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {

  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnEditorTransferCaseSvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnEditorTransferCaseSvgRoot);


export default DnEditorTransferCaseSvgRoot;
