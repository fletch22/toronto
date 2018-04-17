import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });

import SvgRootVisualization from './SvgRootVisualization';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor/index';
import graphTraversal from "../../../../../common/state/graphTraversal";
import viewModelCreator from "../../utils/viewModelCreator";
import actionComponentCreator from "../../../reducers/viewModelFactory";
import ActionInvoker from "../../../actions/ActionInvoker";
import stateTraversal from "../../../../../common/state/stateTraversal";
import ComponentTypes from "../../../../../common/domain/component/ComponentTypes";

const afterDrag = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;
  const modelFromViewModel = args.viewModel;

  const model = actionComponentCreator.extractModelFromModelFromViewModel(modelFromViewModel);
  const parentModel = graphTraversal.findParent(stateNew.model, model.id);

  const index = parentModel.children.findIndex((child) => {
    return child.id === model.id;
  });

  parentModel.children[index] = model;

  return stateNew;
};

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
        // dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, data.viewModel.viewCoordinates.x, data.viewModel.viewCoordinates.y, true));
        // dispatch(afterDrag(data));
        ActionInvoker.invoke(dispatch, afterDrag, data);
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
    const dom = ReactDOM.findDOMNode(this);

    this.svgNodeSelection = d3.select(dom);
    this.drag = this.svgNodeSelection
      .call(SvgRootVisualization.drag, this.beforeDrag, this.onDrag, this.afterDrag);

    this.rootGroupNodeSelection = d3.select(dom);
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.enter);

    this.afterMount(dom);
  }

  shouldComponentUpdate(nextProps) {
    this.rootGroupNodeSelection.datum(nextProps.data);
    return true;
  }

  componentDidUpdate() {
    this.rootGroupNodeSelection.datum(this.props.data)
      .call(SvgRootVisualization.update);

    this.afterUpdate(ReactDOM.findDOMNode(this));
  }

  onDrag(x, y) {
    const data = this.props.data;

    data.viewModel.viewCoordinates = { x, y };
    this.props.onDrag(data);
  }

  getViewDragOffsetCoordinates(xNew, yNew) {
    const yCurrent = this.props.data.viewModel.viewCoordinates.y;
    const xCurrent = this.props.data.viewModel.viewCoordinates.x;

    return { x: xNew - xCurrent, y: yNew - yCurrent };
  }

  beforeDrag() {
    this.props.data.viewModel.viewCoordinatesDragOffset = this.getViewDragOffsetCoordinates(d3.event.x, d3.event.y);
    this.props.beforeDrag(this.props.data);
  }

  afterDrag() {
    this.props.afterDrag(this.props.data);
  }

  afterMount(dom) {
  }

  afterUpdate(dom) {
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
