import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgComponent from './SvgComponent';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import stateTraversal from '../../../../../common/state/stateTraversal';
import dnConnectorModelFactory from '../../../domain/component/dataNarrative/dnConnectorModelFactory';
import DnComponentDealer from './DnComponentDealer';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ActionInvoker from '../../../actions/ActionInvoker';

class DnConnectorOutNexus extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);

    const props = this.props;

    const connector = ReactDOM.findDOMNode(this.refs.connector);
    const connectionSelection = d3.select(connector);
    connectionSelection.on('mousedown', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();

      c.l('mousedown!');
      function mousemove() {
        c.l('Test move');
        props.onMouseMoveConnector();
      }

      function mouseup() {
        c.l('Test up');
        d3.select(this)
          .on('mousemove', null)
          .on('mouseup', null);
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
    g.append('path')
      .attr('d', triangleSymbol)
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .attr('transform', `translate(${iPNT.x}, ${iPNT.y})`);

    let closestConnector;
    Array.from(document.getElementsByClassName('dnConnectorInNexus'))
      .forEach((domNode) => {
        const rect = domNode.getBoundingClientRect();
        const dist = Math.sqrt(Math.pow(rect.x - x + (rect.width / 2), 2) + Math.pow(rect.y - y + (rect.height / 2), 2));

        if (!closestConnector || dist < closestConnector.dist) {
          closestConnector = {
            obj: this,
            dist
          };
        }
      });
    c.l(`Dist2: ${closestConnector.dist}`);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.container)).style('cursor', 'pointer');
  }

  render() {
    return (
      <g ref="container" onMouseOver={this.onMouseOver}>
        <circle ref="connector" cx={this.props.connectorX} cy={this.props.connectorY} r="5" fill="purple" />
        {
          this.props.children.map((child) =>
            <DnComponentDealer {... child} data={child} dataNarrativeView={this.props.data} />
          )
        }
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
  children: PropTypes.array,
  connectorX: PropTypes.number,
  connectorY: PropTypes.number,
  draggingConnector: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const children = !!ownProps.data.viewModel.children ? ownProps.data.viewModel.children : [];

  const draggingConnector = ownProps.data.draggingConnector;

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    children,
    draggingConnector
  };
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

const onMouseMoveConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const view = graphTraversal.find(stateNew, args.data.id);

  view.draggingConnector = {
    position: {
      x: d3.event.x,
      y: d3.event.y
    }
  };

  return stateNew;
};


const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseDownConnector: () => {
      dispatch(onMouseDownConnector(ownProps));
    },
    onMouseMoveConnector: () => {
      ActionInvoker.invoke(dispatch, onMouseMoveConnector, { ...ownProps });
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};


DnConnectorOutNexus = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnectorOutNexus);


export default DnConnectorOutNexus;
