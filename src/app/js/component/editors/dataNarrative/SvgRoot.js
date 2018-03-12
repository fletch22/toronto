import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';
import SvgRootVisualization from './SvgRootVisualization';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';
import DnDataStore from './DnDataStore';

class SvgRoot extends React.Component {

  constructor(props) {
    super(props);
    this.zoomed = this.zoomed.bind(this);
  }

  componentDidMount() {
    this.svgNodeSelection = select(ReactDOM.findDOMNode(this));
    this.svgNodeSelection
      .call(zoom().on('zoom', this.zoomed));

    this.rootGroupNodeSelection = select(ReactDOM.findDOMNode(this.refs.rootGroup));
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.enter);

    this.rootGroupNodeSelection.transition().attr('transform', `translate(${this.props.width / 2}, ${this.props.height / 2})`);
  }

  shouldComponentUpdate(nextProps) {
    this.rootGroupNodeSelection.datum(nextProps.data);
    return true;
  }

  componentDidUpdate() {
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.update);
  }

  zoomed() {
    this.rootGroupNodeSelection.transition().attr('transform', `translate(${this.props.width / 2}, ${this.props.height / 2}) scale(${event.transform.k})`);
    this.props.onMouseZoom(event.transform.k, { x: 0, y: 0 });
  }

  render() {
    const children = (this.props.data.viewModel.children) ? this.props.data.viewModel.children : [];

    return (
      <svg width={this.props.width} height={this.props.height + 10} style={{ border: '1px solid gray' }}>
        <g ref="rootGroup">
          {
            children.map((child) =>
              <DnDataStore {... child} data={child} />
            )
          }
        </g>
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
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMouseZoom: (zoomFactor, mouseCoords) => {
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, zoomFactor, mouseCoords.x, mouseCoords.y, true));
    }
  };
};

SvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRoot);


export default SvgRoot;
