import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });

import SvgRootVisualization from './SvgRootVisualization';
import {actionSetDataNarrativeViewProps} from '../../../actions/bodyChildrenEditor/index';
import DnComponentDealer from './DnComponentDealer';
import SvgComponent from './SvgComponent';
import { drag } from 'd3-drag';
import { event as currentEvent } from 'd3-selection';
import {actionUpdateViewPropertyValue} from '../../../actions';
import SVGDrag from './SVGDrag';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import webServer from '../../../../images/webServer2.svg';
import dataStoreImage from '../../../../images/database-generic.svg';
import dataStoreModelUtils from "../../../../../common/domain/component/dataStoreModelUtils";

class SvgRoot extends SvgComponent {
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

    this.renderSvgComponents();
  }

  setupDragNDrop = (selectionThing) => {
    return selectionThing.call(SVGDrag.setup(this.props.onBeforeDragGeneric, this.props.onDragGeneric, this.props.onAfterDragGeneric));
  };

  renderSvgComponents() {
    const svgRootDom = document.getElementById('svgRootGroup');

    const childrenSelection = d3.select(svgRootDom).selectAll('g')
      .data(this.props.data.viewModel.children, (d) => d.id)
      .enter();

    this.renderChildren(childrenSelection);

    const rectRaw = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const outerRootGroup = d3.select(ReactDOM.findDOMNode(this.refs.outerRootGroup));
    outerRootGroup.attr('transform', (d) => {
      return `translate(${parseInt(rectRaw.width, 10) / 2}, ${parseInt(rectRaw.height, 10) / 2})`;
    });
  }

  renderChildrenFromComponentSelection(componentSelection, data) {
    const childSelection = componentSelection.selectAll('g')
      .data(data.viewModel.children, (childData) => childData.id)
      .enter();

    this.renderChildren(childSelection);
  }

  renderChildren(childrenSelection) {
    const self = this;
    childrenSelection.each(function (d) {
      const component = d3.select(this).append('g');

      switch (d.viewModel.typeLabel) {
        case ComponentTypes.DnConnectorOutNexus: {
          component
            .append('circle')
            .attr('r', 5)
            .attr('cx', d.viewModel.viewCoordinates.x)
            .attr('cy', d.viewModel.viewCoordinates.y)
            .attr('fill', 'CornflowerBlue');
          break;
        }
        case ComponentTypes.DnConnectorInNexus: {
          component
            .append('circle')
            .attr('r', 5)
            .attr('cx', d.viewModel.viewCoordinates.x)
            .attr('cy', d.viewModel.viewCoordinates.y)
            .attr('fill', 'CornflowerBlue');
          break;
        }
        case ComponentTypes.DnBrowser: {
          component.call(self.setupDragNDrop)
            .attr('transform', `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`);

          component.append('rect')
            .attr('rx', 6)
            .attr('width', 100)
            .attr('height', 75)
            .attr('fill', 'gray');

          component.append('text')
            .attr('font-family', 'sans-serif')
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .attr('x', 51)
            .attr('y', 42)
            .attr('alignment-baseline', 'alphabetic')
            .text((d) => 'Browser');

          self.renderChildrenFromComponentSelection(component, d);
          break;
        }
        case ComponentTypes.DnDataStore: {
          component.call(self.setupDragNDrop)
            .attr('transform', `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`);

          component.append('image')
            .attr('xlink:href', dataStoreImage)
            .attr('transform', 'scale(.2)');

          const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(self.props.state);

          component.append('text')
            .attr('font-family', 'sans-serif').attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('alignment-baseline', 'alphabetic')
            .attr('y', 63).attr('x', 41)
            .text(defaultDataStore.label);
          break;
        }
        case ComponentTypes.DnWebServer: {
          component.call(self.setupDragNDrop)
            .attr('transform', `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`);

          component.append('image')
            .attr('xlink:href', webServer)
            .attr('transform', 'scale(.2)');

          component.append('text')
            .attr('font-family', 'sans-serif')
            .attr('fill', 'gray')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'alphabetic')
            .attr('x', '84')
            .attr('y', '45')
            .text((d) => 'Web Server');

          self.renderChildrenFromComponentSelection(component, d);
          break;
        }
        default: {
          component
            .call(self.setupDragNDrop)
            .attr('transform', `translate(${d.viewModel.viewCoordinates.x}, ${d.viewModel.viewCoordinates.y}) scale(${d.viewModel.zoom})`)
            .append('circle')
            .attr('r', 20)
            .attr('cx', '75')
            .attr('cy', '75')
            .attr('fill', 'red');
        }
      }
    });
  }

  afterUpdate() {
    // c.l(`After Update ...`);
    const svgRootDom = document.getElementById('svgRootGroup');

    const children = d3.select(svgRootDom).selectAll('g')
      .data(this.props.data.viewModel.children, (d) => d.id);

    children.remove();

    this.renderSvgComponents();
  }

  zoomed() {
    this.rootGroupNodeSelection.transition().attr('transform', `scale(${selection.event.transform.k})`);
    this.props.onMouseZoom(selection.event.transform.k, { x: 0, y: 0 });
  }

  render() {
    return (
      <svg id="svgRoot" width={this.props.width} height={this.props.height + 10} style={{ border: '1px solid gray' }}>
        <g ref="outerRootGroup">
          <g ref="rootGroup" id="svgRootGroup">
          </g>
        </g>
      </svg>
    );
  }
}

SvgRoot.propTypes = {
  ...SvgComponent.propTypes,
  zoom: PropTypes.number,
  onMouseZoom: PropTypes.func,
  onBeforeDragGeneric: PropTypes.func,
  onDragGeneric: PropTypes.func,
  onAfterDragGeneric: PropTypes.func,
  state: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const data = {
    ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    zoom: ownProps.data.viewModel.zoom,
    state
  };

  data.viewCoordinates = JSON.parse(JSON.stringify(data.viewCoordinates));
  return data;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseZoom: (zoomFactor, mouseCoords) => {
      dispatch(actionSetDataNarrativeViewProps(ownProps.data.id, zoomFactor, mouseCoords.x, mouseCoords.y, true));
    },
    onBeforeDragGeneric: (data) => {
      const yCurrent = data.viewModel.viewCoordinates.y;
      const xCurrent = data.viewModel.viewCoordinates.x;

      const viewCoordinatesDragOffset = { x: d3.event.x - xCurrent, y: d3.event.y - yCurrent };
      dispatch(actionUpdateViewPropertyValue(data.id, 'viewModel.viewCoordinatesDragOffset', viewCoordinatesDragOffset, true));
    },
    onDragGeneric: (data, x, y) => {
      const xNew = x - data.viewModel.viewCoordinatesDragOffset.x;
      const yNew = y - data.viewModel.viewCoordinatesDragOffset.y;

      dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, xNew, yNew, false));
    },
    onAfterDragGeneric: (data) => {
      dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, data.viewModel.viewCoordinates.x, data.viewModel.viewCoordinates.y, true));
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

SvgRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(SvgRoot);


export default SvgRoot;
