import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';
import SvgRootVisualization from './SvgRootVisualization';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';
import DnDataStore from './DnDataStore';
import SvgComponent from './SvgComponent';

class SvgRoot extends SvgComponent {

  constructor(props) {
    super(props);
    this.zoomed = this.zoomed.bind(this);
  }

  componentDidMount() {
    this.svgNodeSelection = select(ReactDOM.findDOMNode(this));
    this.svgNodeSelection
      .call(SvgRootVisualization.drag, this.beforeDrag, this.onDrag, this.afterDrag)
      .call(zoom().on('zoom', this.zoomed));

    c.lo(this.props.data.viewModel, 'componentDidMount: ');

    this.rootGroupNodeSelection = select(ReactDOM.findDOMNode(this.refs.rootGroup));
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.enter);
  }

  zoomed() {
    this.rootGroupNodeSelection.transition().attr('transform', `scale(${event.transform.k})`);
    this.props.onMouseZoom(event.transform.k, { x: 0, y: 0 });
  }

  render() {
    const children = (this.props.data.viewModel.children) ? this.props.data.viewModel.children : [];

    return (
      <svg width={this.props.width} height={this.props.height + 10} style={{ border: '1px solid gray' }}>
        <g>
          <g ref="rootGroup">
            {
              children.map((child) =>
                <DnDataStore {... child} data={child} dataNarrativeView={this.props.data} />
              )
            }
          </g>
        </g>
      </svg>
    );
  }
}

SvgRoot.propTypes = {
  ...SvgComponent.propTypes,
  zoom: PropTypes.number,
  onMouseZoom: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
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

SvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRoot);


export default SvgRoot;
