import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgComponent from './SvgComponent';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import stateTraversal from '../../../../../common/state/stateTraversal';
import dnConnectorModelFactory from '../../../domain/component/dataNarrative/dnConnectorModelFactory';
import DnComponentDealer from './DnComponentDealer';
import { drag } from 'd3-drag';
import { event as currentEvent } from 'd3-selection';

const duration = 10;

const onMouseDown = function () {
  // c.lo(this);

  // this.props.onMouseDownConnector();
};

class DnConnectorNexus extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);

    // this.testDrag(dom);

    const g = d3.select(dom);

    g.selectAll('path').remove();

    const triangle = d3.symbol().type(d3.symbolTriangle);
    g.append('path')
      .attr('d', triangle)
      .attr('fill', 'gray')
      .attr('stroke', 'black')
      .attr('transform', 'rotate(90)')
      .attr('opacity', '.50');

    const connector = ReactDOM.findDOMNode(this.refs.connector);
    d3.select(connector).on('mousedown', () => {

      c.l('firing mouseup');
      // connector.dispatchEvent(new Event('mouseup'));

      d3.event.preventDefault();
      d3.event.stopPropagation();

      // connector.dispatchEvent(new Event('mouseup'));
      // connector.dispatchEvent(new Event('mousedown'));

      this.props.onMouseDownConnector();
    });
    // d3.select(connector).on('mousedown', this.onMouseDownTest);
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.container)).style('cursor', 'pointer');
  }

  dragTest(selection, beforeDrag, onDrag, afterDrag) {
    let draggable = false;
    const dragThing = drag()
      .on('start', () => {
        setTimeout(() => {
          draggable = true;
        }, duration);
        beforeDrag();
      }).on('drag', () => {
        c.l('Trying to stop dragging..');
        currentEvent.preventDefault();
        currentEvent.stopPropagation();
        return;
        // if (!draggable) return;
        // onDrag(currentEvent.x, currentEvent.y);
      }).on('end', () => {
        draggable = false;
        afterDrag();
      });

    selection.call(dragThing);
  }

  testDrag(dom) {
    this.svgNodeSelection = d3.select(dom);
    this.svgNodeSelection
      .call(this.dragTest, this.beforeDrag, this.onDrag, this.afterDrag);
  }

  render() {
    const children = (this.props.data.viewModel.children) ? this.props.data.viewModel.children : [];

    return (
      <g ref="container" onMouseOver={this.onMouseOver}>
        <circle ref="connector" cx="100" cy="39" r="5" fill="purple" />
        {
          children.map((child) =>
            <DnComponentDealer {... child} data={child} dataNarrativeView={this.props.data} />
          )
        }
      </g>
    );
  }
}

DnConnectorNexus.contextTypes = { store: PropTypes.object };

DnConnectorNexus.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.number,
  dataNarrativeView: PropTypes.object,
  onMouseDownConnector: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps) };
};

const onMouseDownConnector = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const viewCoordinates = { x: 100 - 20, y: 39 - 10 };
    const protoModel = { id: stateTraversal.getNextId(state), parentId: ownProps.viewModel.id, viewCoordinates };

    const model = dnConnectorModelFactory.createInstance(protoModel);

    return viewModelCreator.create(dispatch, model, ownProps.id);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseDownConnector: () => {
      dispatch(onMouseDownConnector(ownProps));
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};


DnConnectorNexus = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnectorNexus);


export default DnConnectorNexus;
