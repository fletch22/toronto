// @flow
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SvgUtil from './SvgUtil';
import * as d3 from 'd3';
import 'd3-selection-multi';
import ReactDOM from 'react-dom';
// import _ from 'lodash';
import dnConnectorUtils from './dnConnector/dnConnectorUtils';
import {actionDoNothing} from '../../../actions/index';
import ActionInvoker from '../../../actions/ActionInvoker';
import graphTraversal from '../../../../../common/state/graphTraversal';
import stateUtils from '../../../util/stateUtil';
import stateTraversal from '../../../../../common/state/stateTraversal';
import {
  ComponentTypesCollections,
  default as ComponentTypes
} from '../../../../../common/domain/component/ComponentTypes';
import dnTransferCaseUtility from './dnEditorTransferCase/dnTransferCaseUtility';
// import dnTransferFieldMapperModelFactory from 'app/js/domain/component/dataNarrative/dnTransferFieldMapperModelFactory';
// import dnTransferSourceFieldModelFactory from 'app/js/domain/component/dataNarrative/dnTransferSourceFieldModelFactory';
import dnTransferTargetFieldModelFactory
  from '../../../../../app/js/domain/component/dataNarrative/dnTransferTargetFieldModelFactory';
// import actionCreatePseudoModalFromScratch from 'app/js/actions/index';
// import PseudoModalTypes from 'app/js/component/modals/PseudoModalTypes';
// import viewModelFactory, { ViewModelType } from 'app/js/reducers/viewModelFactory';
// import refUtils from '../../../util/relationshipUtils';

const caseWidth = 20;
const caseHeight = 15;

type Props = {
  id: any,
  parentId: string,
  viewModel: Object,
  data: Object,
  postRender: () => void,
  onClick: () => void,
  isPopupVisible: boolean,
  onClosePopup: () => void,
  isRenderTransferCase: () => void,
  onClickCloseTransferCase: () => void
};


class DnTransferCase extends Component<Props> {

  static onClick = (actionStatePackage, args) => {
    console.log(PI);
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
  static renderTransferCase = (actionStatePackage, args) => {
    const stateNew = actionStatePackage.stateNew;

    c.lo(args, 'args: ');

    const dnTransferCaseView = graphTraversal.find(stateNew, args.id);
    if (!dnTransferCaseView) throw new Error('Could not find transfer case.');

    dnTransferCaseView.renderTransferCase = true;

    dnTransferCaseView.transform = args.transform;

    return stateNew;
  };
  static onClickCloseTransferCase = (actionStatePackage, args) => {

    c.l('Got onClickCloseTransferCase...');

    const stateNew = actionStatePackage.stateNew;

    const dnTransferCaseView = graphTraversal.find(stateNew, args.id);
    if (!dnTransferCaseView) throw new Error('Could not find transfer case.');

    dnTransferCaseView.isPopupVisible = false;

    return stateNew;
  };

  static loadValues(state: Object, dnTransferCaseModel: Object, descendentModel: Object) {
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

  static createPseudoModal(ownProps: Object) {
    return (dispatch, getState) => {
      // Creating/Moving Data from Page to DnTransferCase
      // 1. On buttonSubmit creation, in attribute 'dataSource' BrowserModel provide ref:
      // Status: Done
      //
      // 2. On TransferCase creation, copy refs of refs in BM to TransferCase
      // Status:
      //
      // 3. On buttonSubmit creation, copy refs into DataSource Model
      // Status:
      //
      // 4. On TransferCAse creation copy refs in DataSource to TransferCase
      // Status:

      // Navigating from destination to source
      //  1. Find the child In-Connector
      //  2. Find the In-Connector's Source Ref
      //  3. Find the Source from the ref -- the Out-Connector
      //  4. The out connector contains a set of fields reffed to the container.
      //  5. The container contains a set of fields reffed to the original source.

      // Navigating from source to destination
      //  1. Find the Out-Connector's ref to the In-Connector
      //  2. Jump to the In-Connector.
      //  3. Jump to the parent of the In-Connector
      //  4. Get All the fields.
      //  5. Jump from the fields to the ref of those fields.

      const state = getState();

      let dnTransferCaseModel = graphTraversal.find(state.model, ownProps.data.viewModel.id);
      if (!dnTransferCaseModel) {
        throw new Error('Could not find dnTransferCaseModel.');
      }

      const dnConnector = stateUtils.findAncestorByTypeLabelCollection(state.model, dnTransferCaseModel, [ComponentTypes.DnConnector]); // [ComponentTypesCollections.DnConnector]
      const dnConnectorInNexus = graphTraversal.find(state.model, dnConnector.connectorInNexusId);
      if (!dnConnectorInNexus) {
        throw new Error(`Could not find dnConnectorInNexus ${dnConnector.connectorInNexusId}.`);
      }

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
      if (!dnTransferCaseModel) {
        throw new Error('Could not find dnTransferCaseModel.');
      }

      const refPresent = (child, arr) => {
        return !!arr.find((item) => item.$ref === child.$ref && item.typeLabel === ComponentTypes.DnTransferTargetField);
      };

      if (!dnTransferCaseModel) {
        throw new Error('Could not find dnTransferCaseModel.');
      }
      const children = dnTransferCaseModel.children;
      const idDnTransferCase = dnTransferCaseModel.id;

      const newTargetChildren = dnTransferCaseModel.children
        .filter((child) => child.typeLabel === ComponentTypes.DnTransferSourceField)
        .filter((child) => !refPresent(child, children))
        .map((child) => {
          const ref = stateTraversal.createReference(child.id);
          return dnTransferTargetFieldModelFactory.createInstance(state, idDnTransferCase, ref);
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
        const coords = this.getTransformation();
        const transform = `translate(${coords.x}, ${coords.y})`;
        // const transform = `translate(${200}, ${200})`;

        c.l('Calling isReTC');

        this.props.isRenderTransferCase(transform);
      } else {
        setTimeout(drawTransferCaseWhenReady, 100);
      }
    };

    drawTransferCaseWhenReady();
  }

  // componentDidUpdate(prevProps) {
  //   const coords = this.getTransformation();
  //   const transform = `translate(${coords.x}, ${coords.y})`;
  //
  //   c.l(`${transform} : ${prevProps.transform}`);
  //
  //   if (prevProps.transform !== transform) {
  //     this.props.isRenderTransferCase(transform);
  //   }
  // }

  getTransformation() {
    const parentDom = document.getElementById(this.props.parentId);
    const domNode = ReactDOM.findDOMNode(this.refs.transfer);

    c.lo(this.props.parentId, 'pid: ');

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

    return {x, y};
  }

  getTransferCase() {
    let style = null;
    // const coords = this.getTransformation();
    // transform = `translate(${coords.x}, ${coords.y})`;

    return (
      <rect ref="transfer" rx="6" width={caseWidth} height={caseHeight} fill={dnConnectorUtils.mainBodyColor}
            transform={this.props.transform} style={style}/>
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
  id: PropTypes.any,
  parentId: PropTypes.string,
  viewModel: PropTypes.object,
  data: PropTypes.object,
  postRender: PropTypes.func,
  onClick: PropTypes.func,
  isPopupVisible: PropTypes.bool,
  onClosePopup: PropTypes.func,
  isRenderTransferCase: PropTypes.func,
  onClickCloseTransferCase: PropTypes.func,
  transform: PropTypes.string,
  coordinates: PropTypes.object
};

const getMidwayCoordinates = (tailCoords, headCoords) => ({
  x: (tailCoords.x + ((headCoords.x - tailCoords.x) / 2)) - 8,
  y: (tailCoords.y + ((headCoords.y - tailCoords.y) / 2)) - 8
});

const mapStateToProps = (state, ownProps) => {
  const data = ownProps.data;
  const viewModel = { ...data.viewModel };
  const children = [].concat(viewModel.children) || [];

  let coordMidway = {
    x: 0,
    y: 0
  };

  if (!!data.coordinates) {
    coordMidway = getMidwayCoordinates(data.coordinates.tail, data.coordinates.head);
  }

  return {
    ...ownProps,
    id: data.id,
    parentId: data.parentId,
    viewModel,
    isPopupVisible: data.isPopupVisible,
    children,
    transform: `translate(${coordMidway.x}, ${coordMidway.y})`
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
      ActionInvoker.invoke(dispatch, DnTransferCase.onClickCloseTransferCase, {id: ownProps.data.id});
    },
    isRenderTransferCase: (transform) => {
      c.l(`v: ${transform}`);
      ActionInvoker.invoke(dispatch, DnTransferCase.renderTransferCase, {id: ownProps.data.id, transform});
    }
  };
};

DnTransferCase = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnTransferCase);


export default DnTransferCase;

