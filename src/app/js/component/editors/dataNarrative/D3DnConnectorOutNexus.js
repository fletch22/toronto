// import * as d3 from 'd3';
import dnConnectorModelFactory from '../../../domain/component/dataNarrative/dnConnectorModelFactory';
import stateTraversal from '../../../../../common/state/stateTraversal';
import viewModelFactory from '../../../reducers/viewModelFactory';
import graphTraversal from '../../../../../common/state/graphTraversal';
import DnConnectorInNexus from './DnConnectorInNexus';
import ActionInvoker from '../../../actions/ActionInvoker';
import * as selection from 'd3-selection'; // You must import all d3-selection module
import { zoom, zoomIdentity } from 'd3-zoom'; // An example if you are using zoom functions
const d3 = Object.assign(selection, { zoom, zoomIdentity });
import { event as currentEvent } from 'd3-selection';
import { symbol as d3Symbol, symbolTriangle } from 'd3-shape';

const triangleSymbol = d3Symbol().type(symbolTriangle);

const initState = (state, ownProps) => {
  const props = ownProps;

  const children = props.viewModel.children || [];

  return {
    id: props.id,
    parentId: props.parentId,
    viewModel: props.viewModel,
    viewCoordinates: props.viewCoordinates,
    draggingConnector: props.draggingConnector,
    draggingConnectorVisible: props.draggingConnector ? props.draggingConnector.visible : false,
    children
  };
};

const onSelectClosestConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const inConnectorId = args.inConnectorId;
  const props = initState(stateNew, args);

  const view = graphTraversal.find(stateNew, props.id);
  view.draggingConnector.closestConnectorId = inConnectorId;

  return stateNew;
};

const onMouseMoveConnector = (data, props) => {
  const x = currentEvent.x;
  const y = currentEvent.y;

  const domConnector = document.getElementById(data.id);

  const mySVG = document.getElementById('svgRoot');
  const pnt = mySVG.createSVGPoint();
  pnt.x = x;
  pnt.y = y;

  const SCTM = domConnector.getScreenCTM();
  const iPNT = pnt.matrixTransform(SCTM.inverse());

  if (iPNT) {
    const g = d3.select(domConnector.parentNode);
    g.selectAll('path').remove();

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

  if (!!closestConnector && closestConnector.dist < (closestConnector.radius + 12)) {
    DnConnectorInNexus.renderConnectingHover(closestConnector.obj);
    const inConnectorId = closestConnector.obj.id;
    props.invoke(onSelectClosestConnector, { inConnectorId, ...data });
  } else {
    if (!!closestConnector) {
      DnConnectorInNexus.renderConnectingDeHover(closestConnector.obj);
    }
  }
};

const onMouseUpConnector = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const props = initState(stateNew, args);

  const view = graphTraversal.find(stateNew, props.id);
  view.draggingConnector.visible = false;

  const domNode = document.getElementById(view.draggingConnector.closestConnectorId);
  DnConnectorInNexus.renderConnectingDeHover(domNode);

  view.viewModel.children = [];

  if (view.draggingConnector.closestConnectorId) {
    const id = stateTraversal.findHighestId(stateNew.model);

    const model = dnConnectorModelFactory.createInstance(id, props.viewModel.id, view.draggingConnector.closestConnectorId);
    const parentModel = graphTraversal.find(stateNew.model, props.viewModel.id);
    parentModel.children.push(model);

    const viewModel = viewModelFactory.generateViewModel(props.id, model);
    view.viewModel.children = view.viewModel.children.concat(viewModel);
  }

  view.draggingConnector.closestConnectorId = null;

  return stateNew;
};

class D3DnConnectorOutNexus {
  setup(componentSelection, data, props) {
    componentSelection
      .append('circle')
      .attr('id', data.id)
      .attr('r', 5)
      .attr('cx', data.viewModel.viewCoordinates.x)
      .attr('cy', data.viewModel.viewCoordinates.y)
      .attr('fill', 'CornflowerBlue')
      .on('mousedown', () => {
        currentEvent.preventDefault();
        currentEvent.stopPropagation();

        function mousemove() {
          onMouseMoveConnector(data, props);
        }

        function mouseup() {
          d3.select(this)
            .on('mousemove', null)
            .on('mouseup', null);
          props.invoke(onMouseUpConnector, data);
        }

        d3.select(window)
          .on('mousemove', mousemove)
          .on('mouseup', mouseup);
      });
  }
}

export default new D3DnConnectorOutNexus();
