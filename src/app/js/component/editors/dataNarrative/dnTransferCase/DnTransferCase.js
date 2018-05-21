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
import stateTraversal from '../../../../../../common/state/stateTraversal';
import Button from 'app/js/component/Button';
import TransferMap from './TransferMap';

const caseWidth = 20;
const caseHeight = 15;

class DnTransferCase extends React.Component {

  static onClick = (actionStatePackage, args) => {
    c.l('Got transfer case click...');
    const stateNew = actionStatePackage.stateNew;
    const clickedTransferCaseId = args.id;

    const dnTransferCaseView = graphTraversal.find(stateNew, clickedTransferCaseId);
    // const dnConnectorView = graphTraversal.find(stateNew, dnTransferCaseView.parentId);
    // const dnConnectorOutNexusView = graphTraversal.find(stateNew, dnConnectorView.parentId);
    // const dnObject = graphTraversal.find(stateNew, dnConnectorOutNexusView.parentId);

    // const dnTransferCaseModel = graphTraversal.find(stateNew.model, dnTransferCaseView.viewModel.id);
    // const actualModelIdsFields = stateTraversal.getWebPageFormFields(stateNew.model, dnTransferCaseModel);

    // const modelIds = dnObject.viewModel.sourceFieldIds.map((node) => {
    //   return stateTraversal.getRefIdsFromNode(node);
    // });

    // c.lo(dnObject.viewModel.sourceFieldIds, 'dnObject.viewModel.sourceFieldIds: ');
    // c.lo(modelIds, 'modelIds: ');

    dnTransferCaseView.isPopupVisible = true;

    // If old fields have been deleted, mark them as deleted visually somehow.

    return stateNew;
  };

  static renderTransferCase = (actionStatePackage, args) => {
    const stateNew = actionStatePackage.stateNew;

    const dnTransferCaseView = graphTraversal.find(stateNew, args.id);
    dnTransferCaseView.renderTransferCase = true;

    return stateNew;
  };

  static onClickCloseTransferCase = (actionStatePackage, args) => {

    c.l('Got onClickCloseTransferCase...');

    const stateNew = actionStatePackage.stateNew;

    const dnTransferCaseView = graphTraversal.find(stateNew, args.id);
    dnTransferCaseView.isPopupVisible = false;

    return stateNew;
  };

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
        this.props.isRenderTransferCase();
      } else {
        setTimeout(drawTransferCaseWhenReady, 10);
      }
    };

    drawTransferCaseWhenReady();
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

    return { x, y };
  }

  getTransferCase() {
    let transform = null;
    let style = null;
    if (this.props.isRenderTransferCase) {
      const coords = this.getTransformation();
      transform = `translate(${coords.x}, ${coords.y})`;
    } else {
      style = { display: 'none' };
    }

    return (
      <rect ref="transfer" rx="6" width={caseWidth} height={caseHeight} fill={dnConnectorUtils.mainBodyColor} transform={transform} style={style} />
    );
  }

  getTransferPopup() {
    let rendered;
    const domNode = document.getElementById(this.props.id);

    if (domNode) {
      const coords = this.getTransformation();
      if (this.props.isRenderTransferCase && this.props.isPopupVisible) {
        rendered = (
          <TransferMap parentId={this.props.id} coords={{ x: coords.x, y: coords.y }} onClickClose={this.props.onClickCloseTransferCase} />
        );
      }
    }

    return rendered;
  }

  render() {
    const transferCase = this.getTransferCase();
    const transferPopup = this.getTransferPopup();

    return (
      <g id={this.props.id} ref="rootGroup">
        {
          transferCase
        }
        {
          transferPopup
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
  onClick: PropTypes.func,
  isPopupVisible: PropTypes.bool,
  onClosePopup: PropTypes.func,
  isRenderTransferCase: PropTypes.bool,
  onClickCloseTransferCase: PropTypes.func
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
    isPopupVisible: data.isPopupVisible,
    children
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postRender: () => {
      dispatch(actionDoNothing());
    },
    onClick: () => {
      ActionInvoker.invoke(dispatch, DnTransferCase.onClick, { id: ownProps.data.id });
    },
    onClickCloseTransferCase: () => {
      ActionInvoker.invoke(dispatch, DnTransferCase.onClickCloseTransferCase, { id: ownProps.data.id });
    },
    isRenderTransferCase: () => {
      ActionInvoker.invoke(dispatch, DnTransferCase.renderTransferCase, { id: ownProps.data.id });
    }
  };
};

DnTransferCase = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnTransferCase);


export default DnTransferCase;
