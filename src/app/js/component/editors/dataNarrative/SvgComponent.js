import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });

import { event as currentEvent } from 'd3';
import SvgRootVisualization from './SvgRootVisualization';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';

class SvgComponent extends React.Component {

  static getDragNDropFns(dispatch, ownProps) {
    return {
      beforeDrag: (data) => {
        dispatch(actionUpdateViewPropertyValue(data.id, 'viewModel.viewCoordinatesDragOffset', data.viewModel.viewCoordinatesDragOffset, true));
      },
      onDrag: (data) => {
        const x = data.viewModel.viewCoordinates.x - data.viewModel.viewCoordinatesDragOffset.x;
        const y = data.viewModel.viewCoordinates.y - data.viewModel.viewCoordinatesDragOffset.y;

        dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, x, y, false));
      },
      afterDrag: (data) => {
        dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, data.viewModel.viewCoordinates.x, data.viewModel.viewCoordinates.y, true));
      }
    };
  }

  static mapStateToPropsDragNDrop(state, ownProps) {
    const viewModel = ownProps.data.viewModel;

    return {
      data: ownProps.data,
      size: ownProps.size,
      height: ownProps.height,
      width: ownProps.width,
      viewCoordinates: viewModel.viewCoordinates,
      viewCoordinatesDragOffset: viewModel.viewCoordinatesDragOffset,
      x: viewModel.viewCoordinates.x,
      y: viewModel.viewCoordinates.y
    };
  }

  constructor(props) {
    super(props);
    this.beforeDrag = this.beforeDrag.bind(this);
    this.beforeDrag = this.beforeDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.afterDrag = this.afterDrag.bind(this);
  }

  componentDidMount() {
    this.svgNodeSelection = d3.select(ReactDOM.findDOMNode(this));
    this.svgNodeSelection
      .call(SvgRootVisualization.drag, this.beforeDrag, this.onDrag, this.afterDrag);

    this.rootGroupNodeSelection = d3.select(ReactDOM.findDOMNode(this));

    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.enter);
  }

  shouldComponentUpdate(nextProps) {
    this.rootGroupNodeSelection.datum(nextProps.data);
    return true;
  }

  componentDidUpdate() {
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.update);
  }

  onDrag(x, y) {
    // const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    // const rectRaw = domNode.getBoundingClientRect();

    const data = { ...this.props.data };
    // data.viewModel.viewCoordinates = { x: x - (rectRaw.width / 2) + 10, y: y - (rectRaw.height / 2) };

    data.viewModel.viewCoordinates = { x, y };
    this.props.onDrag(data);
  }

  getViewDragOffsetCoordinates(xNew, yNew) {
    const yCurrent = this.props.data.viewModel.viewCoordinates.y;
    const xCurrent = this.props.data.viewModel.viewCoordinates.x;

    c.l(`yNew: ${yNew}; yCurrent: ${yCurrent}`);

    return { x: xNew - xCurrent, y: yNew - yCurrent };
  }

  beforeDrag() {
    this.props.data.viewModel.viewCoordinatesDragOffset = this.getViewDragOffsetCoordinates(d3.event.x, d3.event.y);

    c.lo(this.props.data.viewModel.viewCoordinatesDragOffset, 'vcdo: ');
    c.lo(this.props.data.viewModel.viewCoordinates, 'vc: ');

    this.props.beforeDrag(this.props.data);
  }

  afterDrag() {
    this.props.afterDrag(this.props.data);
  }
}

SvgComponent.propTypes = {
  data: PropTypes.object,
  size: PropTypes.array,
  height: PropTypes.any,
  width: PropTypes.any,
  zoom: PropTypes.number,
  viewCoordinates: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  onMouseZoom: PropTypes.func,
  beforeDrag: PropTypes.func,
  onDrag: PropTypes.func,
  afterDrag: PropTypes.func,
  viewCoordinatesDragOffset: PropTypes.object
};


export default SvgComponent;
