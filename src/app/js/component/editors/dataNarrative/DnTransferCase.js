import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgUtil from './SvgUtil';
import * as d3 from 'd3';
import 'd3-selection-multi';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import dnConnectorUtils from './dnConnector/dnConnectorUtils';
import { actionDoNothing } from '../../../actions/index';
import ActionInvoker from '../../../actions/ActionInvoker';
import graphTraversal from '../../../../../common/state/graphTraversal';
import stateUtils from '../../../util/stateUtil';
import stateTraversal from '../../../../../common/state/stateTraversal';
import { default as ComponentTypes, ComponentTypesCollections } from 'common/domain/component/ComponentTypes';
import dnTransferCaseUtility from './dnEditorTransferCase/dnTransferCaseUtility';
import dnTransferFieldMapperModelFactory from 'app/js/domain/component/dataNarrative/dnTransferFieldMapperModelFactory';
import dnTransferSourceFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferSourceFieldModelFactory';
import dnTransferTargetFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferTargetFieldModelFactory';
import actionCreatePseudoModalFromScratch from 'app/js/actions/index';
import PseudoModalTypes from 'app/js/component/modals/PseudoModalTypes';
import viewModelFactory, { ViewModelType } from 'app/js/reducers/viewModelFactory';

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
    // const actualModelIdsFields = stateTraversal.getWebPageFormFieldsAsRefs(stateNew.model, dnTransferCaseModel);

    // const modelIds = dnObject.viewModel.sourceFieldIds.map((node) => {
    //   return stateTraversal.getRefIdsFromNode(node);
    // });

    // c.lo(dnObject.viewModel.sourceFieldIds, 'dnObject.viewModel.sourceFieldIds: ');
    // c.lo(modelIds, 'modelIds: ');

    // dnTransferCaseView.isPopupVisible = true;

    // If old fields have been deleted, mark them as deleted visually somehow.

    return stateNew;
  };

  static loadValues(state, dnTransferCaseModel, descendentModel) {
    const foundNexusNode = stateUtils.findAncestorByTypeLabelCollection(state.model, descendentModel, ComponentTypesCollections.DataNarrativeNexusNodes);

    let dnTransferCaseModelModified;
    switch (foundNexusNode.typeLabel) {
      case ComponentTypes.DnBrowser: {
        const webPageModel = graphTraversal.find(state.model, foundNexusNode.dataSource.$ref);
        const fieldsForm = stateTraversal.getAllFieldsFromModelAsRefs(webPageModel);
        dnTransferCaseModelModified = dnTransferCaseUtility.ensureRefFieldAdded(state, fieldsForm, dnTransferCaseModel, ComponentTypes.DnTransferSourceField);
        break;
      }
      case ComponentTypes.DnWebServer: {
        // c.lo(foundNexusNode, 'foundNexusNode: ');

        // Find incoming connection
        // const dnConnectorIn = 
        // Find related connector
        // Fill in missing fields.
        // dnTransferCaseModelModified = dnTransferCaseUtility.ensureRefFieldAdded(state, fieldsForm, dnTransferCaseModel, ComponentTypes.DnTransferSourceField);
        break;
      }
      default: {
        throw new Error(`Encountered problem trying to find typeLabel ${foundNexusNode.typeLabel}`);
      }
    }

    return dnTransferCaseModelModified;
  }

  static createPseudoModal(ownProps) {
    return (dispatch, getState) => {
      const state = getState();

      let dnTransferCaseModel = graphTraversal.find(state.model, ownProps.data.viewModel.id);
      const dnConnector = stateUtils.findAncestorByTypeLabelCollection(state.model, dnTransferCaseModel, [ComponentTypes.DnConnector]); // [ComponentTypesCollections.DnConnector]
      const dnConnectorInNexus = graphTraversal.find(state.model, dnConnector.connectorInNexusId);

      // c.lo(dnConnectorInNexus, 'dnConnectorInNexus: ');

      // const dnGrandParent = graphTraversal.find(state.model, dnConnectorInNexus.parentId);
      // c.lo(dnGrandParent, 'dnGrandParent: ');
      // const dnGreatGrandParent = graphTraversal.find(state.model, dnGrandParent.parentId);
      // c.lo(dnGreatGrandParent, 'dnGreatGrandParent: ');

      const foundSourceNexusNode = stateUtils.findAncestorByTypeLabelCollection(state.model, dnTransferCaseModel, ComponentTypesCollections.DataNarrativeNexusNodes);
      // const foundTargetNexusNode = stateUtils.findAncestorByTypeLabelCollection(state.model, dnConnectorInNexus, ComponentTypesCollections.DataNarrativeNexusNodes);

      // c.l(`tnn: ${JSON.stringify(foundTargetNexusNode.dataSource)}`);

      const webPageModel = graphTraversal.find(state.model, foundSourceNexusNode.dataSource.$ref);
      const fieldsForm = stateTraversal.getAllFieldsFromModelAsRefs(webPageModel);

      // c.lo(foundSourceNexusNode.sourceFieldIds, 'foundSourceNexusNode.sourceFieldIds: ');

      dnTransferCaseModel = dnTransferCaseUtility.ensureRefFieldAdded(state, fieldsForm, dnTransferCaseModel, ComponentTypes.DnTransferSourceField);

      const refPresent = (child, arr) => {
        return !!arr.find((item) => item.$ref === child.$ref && item.typeLabel === ComponentTypes.DnTransferTargetField);
      };

      const newTargetChildren = dnTransferCaseModel.children
        .filter((child) => child.typeLabel === ComponentTypes.DnTransferSourceField)
        .filter((child) => !refPresent(child, dnTransferCaseModel.children))
        .map((child) => {
          const ref = stateTraversal.createReference(child.id);
          return dnTransferTargetFieldModelFactory.createInstance(state, dnTransferCaseModel.id, ref);
        });

      // c.lo(newTargetChildren, 'newTargetChildren: ');
      dnTransferCaseModel.children = dnTransferCaseModel.children.concat(newTargetChildren);

      // c.lo(dnTransferCaseModel, 'dnTransferCaseModel: ');

      DnTransferCase.loadValues(state, dnTransferCaseModel, dnConnectorInNexus);

      //
      // if (foundTargetNexusNode.sourceFieldIds) {
      //   DnTransferCase.ensureRefFieldAdded(state, foundTargetNexusNode.sourceFieldIds, dnTransferCaseModel, ComponentTypes.DnTransferTargetField);
      // }
      //
      // const viewModel = viewModelFactory.generateViewModelFromViewModelType(ownProps.data.parentId, ViewModelType.DnTransferCaseEditor, dnTransferCaseModel);
      //
      // c.lo(viewModel, 'vm: ');

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
    const coords = this.getTransformation();
    transform = `translate(${coords.x}, ${coords.y})`;

    return (
      <rect ref="transfer" rx="6" width={caseWidth} height={caseHeight} fill={dnConnectorUtils.mainBodyColor} transform={transform} style={style} />
    );
  }

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
