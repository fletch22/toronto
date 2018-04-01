import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgComponent from './SvgComponent';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ActionInvoker from '../../../actions/ActionInvoker';

class DnConnectorOutNexus extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  componentDidMount() {
    const props = this.props;

    const connector = ReactDOM.findDOMNode(this.refs.connector);
    const connectionSelection = d3.select(connector);
    connectionSelection.on('mousedown', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();

      // c.l('mousedown!');
      function mousemove() {
        // c.l('Test move');
        props.onMouseMoveConnector();
      }

      function mouseup() {
        // c.l('Test up');
        d3.select(this)
          .on('mousemove', null)
          .on('mouseup', null);
        props.onMouseUpConnector();
      }

      d3.select(window)
        .on('mousemove', mousemove)
        .on('mouseup', mouseup);

      // this.props.onMouseDownConnector();
    });
  }

  componentDidUpdate() {
    const dom = ReactDOM.findDOMNode(this.refs.container);
    const g = d3.select(dom);

    const domConnector = ReactDOM.findDOMNode(this.refs.connector);

    let iPNT;
    const draggingConnector = this.props.data.draggingConnector;
    let x = 0;
    let y = 0;
    let SCTM = null;
    if (!!draggingConnector) {
      x = (draggingConnector.position.x);
      y = draggingConnector.position.y;

      const mySVG = document.getElementById('svgRoot');
      const pnt = mySVG.createSVGPoint();
      pnt.x = x;
      pnt.y = y;

      SCTM = domConnector.getScreenCTM();
      iPNT = pnt.matrixTransform(SCTM.inverse());
    }

    g.selectAll('path').remove();

    const triangleSymbol = d3.symbol().type(d3.symbolTriangle);

    if (iPNT) {
      g.append('path')
        .attr('d', triangleSymbol)
        .attr('fill', 'red')
        .attr('stroke', 'red')
        .attr('transform', `translate(${iPNT.x}, ${iPNT.y})`);
    }

    let closestConnector;
    Array.from(document.getElementsByClassName('dnConnectorInNexus'))
      .forEach((domNode) => {
        const rect = domNode.getBoundingClientRect();
        const dist = Math.sqrt(Math.pow(rect.x - x + (rect.width / 2), 2) + Math.pow(rect.y - y + (rect.height / 2), 2));

        if (!closestConnector || dist < closestConnector.dist) {
          closestConnector = {
            obj: domNode,
            dist
          };
        }
      });

    // if (closestConnector) c.l(`Target ID: ${closestConnector.obj.getAttribute('id')}`);
    c.lo(closestConnector.obj.id);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.container)).style('cursor', 'pointer');
  }

  render() {

    // <circle ref="connector" id={this.props.id} cx={this.props.viewModel.viewCoordinates.x} cy={this.props.viewModel.viewCoordinates.y} r="5" fill="purple" />

    return (
      <g ref="container" onMouseOver={this.onMouseOver}>
        <circle ref="connector" cx={this.props.viewModel.viewCoordinates.x} cy={this.props.viewModel.viewCoordinates.y} r="5" fill="purple" />
      </g>
    );
  }
}

DnConnectorOutNexus.contextTypes = { store: PropTypes.object };

DnConnectorOutNexus.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.number,
  dataNarrativeView: PropTypes.object,
  onMouseDownConnector: PropTypes.func,
  onMouseMoveConnector: PropTypes.func,
  onMouseUpConnector: PropTypes.func,
  children: PropTypes.array,
  connectorX: PropTypes.number,
  connectorY: PropTypes.number,
  draggingConnector: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const children = !!ownProps.data.viewModel.children ? ownProps.data.viewModel.children : [];

  // c.lo(ownProps.data, 'ownProps.data: ');
  // c.lo(ownProps, 'ownProps: ');

  const draggingConnector = { ...ownProps.draggingConnector };
  return {
    children,
    draggingConnector
  };
};

// const onMouseDownConnector = (ownProps) => {
//   return (dispatch, getState) => {
//     const state = getState();
//
//     const viewCoordinates = { x: 100 - 20, y: 39 - 10 };
//     const protoModel = { id: stateTraversal.getNextId(state), parentId: ownProps.viewModel.id, viewCoordinates };
//
//     const model = dnConnectorModelFactory.createInstance(protoModel);
//
//     return viewModelCreator.create(dispatch, model, ownProps.id);
//   };
// };

const onMouseMoveConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const view = graphTraversal.find(stateNew, args.id);

  view.draggingConnector = {
    position: {
      x: d3.event.x,
      y: d3.event.y
    }
  };

  return stateNew;
};

const onMouseUpConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  c.l('OnMouseUpConnector fired.');

  return stateNew;
};


const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseDownConnector: () => {
      // dispatch(onMouseDownConnector(ownProps));
    },
    onMouseMoveConnector: () => {
      ActionInvoker.invoke(dispatch, onMouseMoveConnector, { ...ownProps });
    },
    onMouseUpConnector: () => {
      ActionInvoker.invoke(dispatch, onMouseUpConnector, { ...ownProps });
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};


DnConnectorOutNexus = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnectorOutNexus);


export default DnConnectorOutNexus;
