import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgUtil from './SvgUtil';
import * as d3 from 'd3';
import 'd3-selection-multi';
import dnConnectorUtils from './dnConnector/dnConnectorUtils';
import ReactDOM from 'react-dom';
import { actionDoNothing } from '../../../actions/index';
import ActionInvoker from '../../../actions/ActionInvoker';
import graphTraversal from '../../../../../common/state/graphTraversal';
import stateUtils from '../../../util/stateUtil';
import stateTraversal from '../../../../../common/state/stateTraversal';
import { default as ComponentTypes, ComponentTypesCollections } from 'common/domain/component/ComponentTypes';
import dnTransferFieldMapperModelFactory from 'app/js/domain/component/dataNarrative/dnTransferFieldMapperModelFactory';
import dnTransferSourceFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferSourceFieldModelFactory';
import dnTransferTargetFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferTargetFieldModelFactory';

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

    // dnTransferCaseView.isPopupVisible = true;

    // If old fields have been deleted, mark them as deleted visually somehow.

    return stateNew;
  };

  static createPseudoModal(ownProps) {
    return (dispatch, getState) => {
      const state = getState();
      // c.lo(ownProps.data.viewModel, 'ownProps.data.viewModel: ');

      const dnTransferCaseView = ownProps.data;
      // c.lo(dnTransferCaseView, 'dnTransferCaseView: ');

      const dnTransferCaseModel = graphTraversal.find(state.model, ownProps.data.viewModel.id);
      const dnConnector = stateUtils.findAncestorByTypeLabelCollection(state.model, dnTransferCaseModel, [ComponentTypes.DnConnector]); // [ComponentTypesCollections.DnConnector]
      const dnConnectorInNexus = graphTraversal.find(state.model, dnConnector.connectorInNexusId);

      const foundTargetNexusNode = stateUtils.findAncestorByTypeLabelCollection(state.model, dnConnectorInNexus, ComponentTypesCollections.DataNarrativeNexusNodes);
      const parentNode = graphTraversal.findParent(state.model, dnConnectorInNexus.id);
      // c.lo(parentNode, 'parentNode: ');

      const foundSourceNexusNode = stateUtils.findAncestorByTypeLabelCollection(state.model, dnTransferCaseModel, ComponentTypesCollections.DataNarrativeNexusNodes);

      if (!dnTransferCaseModel.fieldMapper) {
        // Popuplate with all fields in nexus node;
        const fieldMapper = dnTransferFieldMapperModelFactory.createInstance(state, dnTransferCaseModel.id);

        // c.lo(dnConnectorInNexus, 'dnConnectorInNexus: ');
        // c.lo(foundSourceNexusNode, 'foundSourceNexusNode: ');
        c.lo(foundTargetNexusNode, 'foundTargetNexusNode: ');


        for (const fieldId of foundSourceNexusNode.sourceFieldIds) {
          const refField = stateTraversal.createReference(fieldId);
          const transferField = dnTransferSourceFieldModelFactory.createInstance(state, dnTransferCaseModel.parentId, refField);
          fieldMapper.children.push(transferField);
        }

        // for (const fieldId of foundSourceNexusNode.sourceFieldIds) {
        //   const refField = stateTraversal.createReference(fieldId);
        //   const transferField = dnTransferSourceFieldModelFactory.createInstance(state, dnTransferCaseModel.parentId, refField);
        //   fieldMapper.children.push(transferField);
        // }
      }

      // const model = graphTraversal.findGrandParent(state.model, ownProps.data.viewModel.id);
      // c.lo(model, 'model: ');
      // const dnConnectorView = graphTraversal.find(state, dnTransferCaseView.parentId);
      // const dnConnectorOutNexusView = graphTraversal.find(state, dnConnectorView.parentId);
      // const dnObject = graphTraversal.find(state, dnConnectorOutNexusView.parentId);
      //
      // // const dnTransferCaseModel = graphTraversal.find(state.model, dnTransferCaseView.viewModel.id);
      // // const actualModelIdsFields = stateTraversal.getWebPageFormFields(state.model, dnTransferCaseModel);
      //
      // const modelIds = dnObject.viewModel.sourceFieldIds.map((node) => {
      //   return stateTraversal.getRefIdsFromNode(node);
      // });
      //
      // const viewModel = viewModelFactory.generateViewModel(ownProps.data.id, model);
      // c.lo(modelIds, 'vm: ');
      //
      // dispatch(actionCreatePseudoModalFromScratch(PseudoModalTypes.DataNarrativeTransferCaseEditor, viewModel));
    };
  }

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
      c.l('About to click.');
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
    const parentDom = document.getElementById(this.props.id);
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);

    // const rectNode = document.getElementById(this.refs.transfer);
    //
    // c.lo(this.props.data, 'data:');
    // c.l(`Found domNode: ${domNode !== null}`);
    // c.l(`DomNode tag: ${domNode.tagName}`);

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
    // if (this.props.isRenderTransferCase) {
    const coords = this.getTransformation();
    transform = `translate(${coords.x}, ${coords.y})`;
    // } else {
    //   style = { display: 'none' };
    // }

    return (
      <rect ref="transfer" rx="6" width={caseWidth} height={caseHeight} fill={dnConnectorUtils.mainBodyColor} transform={transform} style={style} />
    );
  }

  // getTransferPopup() {
  //   let rendered;
  //   const domNode = document.getElementById(this.props.id);
  //
  //   if (domNode) {
  //     const coords = this.getTransformation();
  //     if (this.props.isRenderTransferCase && this.props.isPopupVisible) {
  //       rendered = (
  //         <TransferMap parentId={this.props.id} coords={{ x: coords.x, y: coords.y }} onClickClose={this.props.onClickCloseTransferCase} />
  //       );
  //     }
  //   }
  //
  //   return rendered;
  // }

  render() {
    const transferCase = this.getTransferCase();

    return (
      <g ref="rootGroup">
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
      // ActionInvoker.invoke(dispatch, DnTransferCase.onClick, { id: ownProps.data.id });
      dispatch(DnTransferCase.createPseudoModal(ownProps));
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
