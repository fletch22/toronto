import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DnConnectorInNexus from './DnConnectorInNexus';
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

      function mousemove() {
        props.onMouseMoveConnector();
      }

      function mouseup() {
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
    // c.l('ComponentDidUpdate...');

    const dom = ReactDOM.findDOMNode(this.refs.container);
    const g = d3.select(dom);

    const domConnector = ReactDOM.findDOMNode(this.refs.connector);

    let iPNT;
    const draggingConnector = this.props.draggingConnector;

    // c.lo(draggingConnector, 'dc: ');

    g.selectAll('path').remove();

    if (this.props.draggingConnector.visible) {
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

      const triangleSymbol = d3.symbol().type(d3.symbolTriangle);

      if (iPNT) {
        g.append('path')
          .attr('d', triangleSymbol)
          .attr('fill', 'CornflowerBlue')
          .attr('transform', `translate(${iPNT.x}, ${iPNT.y}) rotate(90) scale(1.4)`);
      }

      let closestConnector;
      Array.from(document.getElementsByClassName('dnConnectorInNexus'))
        .forEach((domNode) => {
          const rect = domNode.getBoundingClientRect();
          const dist = Math.sqrt(Math.pow(rect.x - x + (rect.width / 2), 2) + Math.pow(rect.y - y + (rect.height / 2), 2));

          if (!closestConnector || dist < closestConnector.dist) {
            closestConnector = {
              obj: domNode,
              dist,
              radius: rect.width / 2
            };
          }
        });

      if (closestConnector && closestConnector.dist < (closestConnector.radius + 12)) {
        DnConnectorInNexus.renderConnectingHover(closestConnector.obj);
        this.props.onSelectClosestConnector(closestConnector.obj.id);
      } else {
        DnConnectorInNexus.renderConnectingDeHover(closestConnector.obj);
      }
    }
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.container)).style('cursor', 'pointer');
  }

  render() {
    return (
      <g ref="container" onMouseOver={this.onMouseOver}>
        <circle ref="connector" cx={this.props.viewModel.viewCoordinates.x} cy={this.props.viewModel.viewCoordinates.y} r="5" fill="CornflowerBlue" />
      </g>
    );
  }
}

DnConnectorOutNexus.propTypes = {
  id: PropTypes.number,
  onMouseDownConnector: PropTypes.func,
  onMouseMoveConnector: PropTypes.func,
  onMouseUpConnector: PropTypes.func,
  onSelectClosestConnector: PropTypes.func,
  draggingConnector: PropTypes.object,
  draggingConnectorVisible: PropTypes.bool,
  viewModel: PropTypes.object,
  viewCoordinates: PropTypes.object
};


const initState = (state, ownProps) => {
  const props = ownProps.data;

  return {
    id: props.id,
    viewModel: props.viewModel,
    viewCoordinates: props.viewCoordinates,
    draggingConnector: props.draggingConnector,
    draggingConnectorVisible: props.draggingConnector.visible
  };
};

const mapStateToProps = (state, ownProps) => {
  return initState(state, ownProps);
};

const onMouseMoveConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const props = initState(stateNew, args);

  const view = graphTraversal.find(stateNew, props.id);
  view.draggingConnector = {
    position: {
      x: d3.event.x,
      y: d3.event.y
    },
    visible: true
  };

  return stateNew;
};

const onMouseUpConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const props = initState(stateNew, args);

  const view = graphTraversal.find(stateNew, props.id);
  view.draggingConnector.visible = false;

  const domNode = document.getElementById(view.draggingConnector.closestConnectorId);
  DnConnectorInNexus.renderConnectingDeHover(domNode);
  view.draggingConnector.closestConnectorId = null;

  return stateNew;
};

const onSelectClosestConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const inConnectorId = args.inConnectorId;
  const props = initState(stateNew, args);

  const view = graphTraversal.find(stateNew, props.id);
  view.draggingConnector.closestConnectorId = inConnectorId;

  c.l(`${view.draggingConnector.closestConnectorId}: foo`);

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onMouseDownConnector: () => {
      // dispatch(onMouseDownConnector(ownProps));
    },
    onMouseMoveConnector: () => {
      ActionInvoker.invoke(dispatch, onMouseMoveConnector, ownProps);
    },
    onMouseUpConnector: () => {
      ActionInvoker.invoke(dispatch, onMouseUpConnector, ownProps);
    },
    onSelectClosestConnector: (id) => {
      ActionInvoker.invoke(dispatch, onSelectClosestConnector, { inConnectorId: id, ...ownProps });
    }
  };
};


DnConnectorOutNexus = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnectorOutNexus);


export default DnConnectorOutNexus;
