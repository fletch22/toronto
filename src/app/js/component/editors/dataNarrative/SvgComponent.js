import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';
import SvgRootVisualization from './SvgRootVisualization';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';

class SvgComponent extends React.Component {

  static getDragNDropFns(dispatch, ownProps) {
    return {
      onMouseZoom: (zoomFactor, mouseCoords) => {
        dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, zoomFactor, mouseCoords.x, mouseCoords.y, true));
      },
      beforeDrag: (newProps) => {
        dispatch(actionUpdateViewPropertyValue(ownProps.data.id, 'viewCoordinatesDragOffset', newProps.viewModel.viewCoordinatesDragOffset, true));
      },
      onDrag: (newProps) => {
        const x = newProps.viewModel.viewCoordinates.x - newProps.viewModel.viewCoordinatesDragOffset.x;
        const y = newProps.viewModel.viewCoordinates.y - newProps.viewModel.viewCoordinatesDragOffset.y;
        dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, newProps.zoom, x, y, false));
      },
      afterDrag: (newProps) => {
        dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, newProps.zoom, newProps.viewModel.viewCoordinates.x, newProps.viewModel.viewCoordinates.y, true));
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
      zoom: viewModel.zoom,
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
    this.svgNodeSelection = select(ReactDOM.findDOMNode(this));
    this.svgNodeSelection
      .call(SvgRootVisualization.drag, this.beforeDrag, this.onDrag, this.afterDrag)
      .call(zoom().on('zoom', this.zoomed));

    this.rootGroupNodeSelection = select(ReactDOM.findDOMNode(this.refs.rootGroup));
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
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const rectRaw = domNode.getBoundingClientRect();

    const data = Object.assign({}, this.props.data);
    data.viewModel.viewCoordinates = { x: x - (rectRaw.width / 2), y: y - (rectRaw.height / 2) };
    this.props.onDrag(data);
  }

  getViewDragOffsetCoordinates(xNew, yNew) {
    const yCurrent = this.props.data.viewModel.viewCoordinates.y;
    const xCurrent = this.props.data.viewModel.viewCoordinates.x;
    return { x: xNew - xCurrent, y: yNew - yCurrent };
  }

  beforeDrag() {
    c.lo(event.x);



    this.props.data.viewModel.viewCoordinatesDragOffset = this.getViewDragOffsetCoordinates(event.x, event.y);
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
