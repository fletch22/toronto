import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgUtil from '../SvgUtil';
import * as d3 from 'd3';
import 'd3-selection-multi';
import dnConnectorUtils from '../dnConnector/dnConnectorUtils';
import ReactDOM from 'react-dom';
import { actionDoNothing } from '../../../../actions/index';
import ActionInvoker from '../../../../actions/ActionInvoker';
import graphTraversal from '../../../../../../common/state/graphTraversal';

const caseWidth = 20;
const caseHeight = 15;

class DnTransferCase extends React.Component {
  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);

    g.on('click', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();

      this.props.onClick();
    });

    g.on('mousemove', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });

    g.on('dblclick', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });

    const drawTransferCaseWhenReady = () => {
      const parentDom = document.getElementById(this.props.parentId);

      if (parentDom) {
        const selection = d3.select(domNode).selectAll('rect');

        selection
          .attr('style', 'display:block')
          .attr('transform', this.getTransformation());
      } else {
        setTimeout(drawTransferCaseWhenReady, 10);
      }
    };

    drawTransferCaseWhenReady();

    this.props.postRender();
  }

  getTransformation() {
    const parentDom = document.getElementById(this.props.parentId);
    const domNode = document.getElementById(this.props.id);

    let x = 0;
    let y = 0;
    if (parentDom && domNode) {
      const coords = SvgUtil.translateRelativeToNode(parentDom, domNode);
      x = coords.x;
      y = coords.y;
    }

    if (parentDom) {
      x += Math.abs(parseInt(parentDom.getAttribute('x2'), 10) - parseInt(parentDom.getAttribute('x1'), 10)) / 2;
      y += Math.abs(parseInt(parentDom.getAttribute('y2'), 10) - parseInt(parentDom.getAttribute('y1'), 10)) / 2;

      x -= caseWidth / 2;
      y -= caseHeight / 2;
    }

    return `translate(${x}, ${y})`;
  }

  getTransferCase() {
    const parentDom = document.getElementById(this.props.parentId);

    let transform = null;
    let style = null;
    if (parentDom) {
      transform = this.getTransformation();
    } else {
      style = { display: 'none' };
    }

    return (
      <rect ref="transfer" rx="6" width={caseWidth} height={caseHeight} fill={dnConnectorUtils.color} transform={transform} style={style} />
    );
  }

  render() {
    const transferCase = this.getTransferCase();
    return (
      <g id={this.props.id} ref="rootGroup">
        {
          transferCase
        }
      </g>
    );
  }
}

DnTransferCase.propTypes = {
  id: PropTypes.number,
  parentId: PropTypes.string,
  viewModel: PropTypes.object,
  data: PropTypes.object,
  postRender: PropTypes.func,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const data = ownProps.data;
  const viewModel = { ...data.viewModel };

  const children = [].concat(viewModel.children) || [];

  return {
    ...ownProps,
    id: data.id,
    parentId: data.parentId,
    viewModel,
    children
  };
};

const onClick = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;
  const clickedTransferCaseId = args.id;

  const dnTransferCase = graphTraversal.find(stateNew, clickedTransferCaseId);
  c.l(`Found transferCase: ${!!dnTransferCase}`);

  c.lo(dnTransferCase, 'dnTransferCase: ');

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postRender: () => {
      dispatch(actionDoNothing());
    },
    onClick: () => {
      ActionInvoker.invoke(dispatch, onClick, { id: ownProps.data.id });
    }
  };
};

DnTransferCase = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnTransferCase);


export default DnTransferCase;
