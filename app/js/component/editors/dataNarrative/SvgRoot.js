import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';
import SvgRootVisualization from './SvgRootVisualization';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';

class SvgRoot extends React.Component {

  constructor(props) {
    super(props);
    this.addRect = this.addRect.bind(this);
    this.zoomed = this.zoomed.bind(this);
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

    this.addRect();
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
    const data = Object.assign({}, this.props.data);
    data.viewCoordinates = { x: 0, y };
    this.props.onDrag(data);
  }

  getViewDragOffsetCoordinates(yNew) {
    const yCurrent = this.props.data.viewCoordinates.y;

    return { x: 0, y: yNew - yCurrent };
  }

  beforeDrag() {
    this.props.data.viewCoordinatesDragOffset = this.getViewDragOffsetCoordinates(event.subject.y);
    this.props.beforeDrag(this.props.data);
  }

  afterDrag() {
    this.props.afterDrag(this.props.data);
  }

  zoomed() {
    this.rootGroupNodeSelection.transition().attr('transform', `translate(${this.props.data.viewCoordinates.x}, ${this.props.data.viewCoordinates.y}) scale(${event.transform.k})`);
    this.props.onMouseZoom(event.transform.k, { x: this.props.data.viewCoordinates.x, y: this.props.data.viewCoordinates.y });
  }

  addRect() {
    this.rootGroupNodeSelection
    .append('rect')
      .attr('width', '200')
      .attr('height', '200')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'steelblue');

    // this.rootGroupNodeSelection
    //   .append('rect')
    //   .attr('width', '300')
    //   .attr('height', '300')
    //   .attr('x', 100)
    //   .attr('y', 0)
    //   .style('fill', 'steelblue');
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height + 10} style={{ border: "1px solid gray" }}>
          <g ref="rootGroup"></g>
      </svg>
    );
  }
}

SvgRoot.propTypes = {
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

const mapStateToProps = (state, ownProps) => {

  // let newCoord = Object.assign({}, ownProps.data.viewCoordinates);
  // c.lo(newCoord, 'newCoord: ');

  return {
    data: ownProps.data,
    size: ownProps.size,
    height: ownProps.height,
    width: ownProps.width,
    zoom: ownProps.data.zoom,
    viewCoordinates: ownProps.data.viewCoordinates,
    viewCoordinatesDragOffset: ownProps.data.viewCoordinatesDragOffset,
    x: ownProps.data.viewCoordinates.x,
    y: ownProps.data.viewCoordinates.y
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMouseZoom: (zoomFactor, mouseCoords) => {
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, zoomFactor, mouseCoords.x, mouseCoords.y, true));
    },
    beforeDrag: (newProps) => {
      dispatch(actionUpdateViewPropertyValue(ownProps.data.id, 'viewCoordinatesDragOffset', newProps.viewCoordinatesDragOffset, true));
    },
    onDrag: (newProps) => {
      const x = newProps.viewCoordinates.x - newProps.viewCoordinatesDragOffset.x;
      const y = newProps.viewCoordinates.y - newProps.viewCoordinatesDragOffset.y;
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, newProps.zoom, x, y, false));
    },
    afterDrag: (newProps) => {
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, newProps.zoom, newProps.viewCoordinates.x, newProps.viewCoordinates.y, true));
    }
  };
};

SvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRoot);


export default SvgRoot;
