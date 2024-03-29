import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });

import SvgRootVisualization from './SvgRootVisualization';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';
import DnComponentDealer from './DnComponentDealer';
import SvgComponent from './SvgComponent';

class DnEditorMasterSvgRoot extends SvgComponent {
  constructor(props) {
    super(props);
    this.zoomed = this.zoomed.bind(this);
  }

  componentDidMount() {
    this.svgNodeSelection = d3.select(ReactDOM.findDOMNode(this));
    this.svgNodeSelection
      .call(SvgRootVisualization.drag, this.beforeDrag, this.onDrag, this.afterDrag)
      .call(d3.zoom().on('zoom', this.zoomed));

    this.rootGroupNodeSelection = d3.select(ReactDOM.findDOMNode(this.refs.rootGroup));
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.enter);

    // NOTE: Center the Play Area
    const rectRaw = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const outerRootGroup = d3.select(ReactDOM.findDOMNode(this.refs.outerRootGroup));
    outerRootGroup.attr('transform', (d) => {
      return `translate(${parseInt(rectRaw.width, 10) / 2}, ${parseInt(rectRaw.height, 10) / 2})`;
    });
  }

  zoomed() {
    this.rootGroupNodeSelection.transition().attr('transform', `scale(${selection.event.transform.k})`);
    this.props.onMouseZoom(selection.event.transform.k, { x: 0, y: 0 });
  }

  render() {
    const children = (this.props.data.viewModel.children) ? this.props.data.viewModel.children : [];

    return (
      <svg id="svgRoot" width={this.props.width} height={this.props.height + 10} style={{ border: '1px solid gray' }}>
        <g ref="outerRootGroup">
          <g ref="rootGroup">
            {
              children.map((child) =>
                <DnComponentDealer key={child.id} {... child} data={child} dataNarrativeView={this.props.data} />
              )
            }
          </g>
        </g>
      </svg>
    );
  }
}

DnEditorMasterSvgRoot.propTypes = {
  ...SvgComponent.propTypes,
  zoom: PropTypes.number,
  onMouseZoom: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  // c.lo(ownProps.data.viewModel.children, 'svgrootchilluns: ');

  return {
    ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    zoom: ownProps.data.viewModel.zoom
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseZoom: (zoomFactor, mouseCoords) => {
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, zoomFactor, mouseCoords.x, mouseCoords.y, true));
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnEditorMasterSvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnEditorMasterSvgRoot);


export default DnEditorMasterSvgRoot;
