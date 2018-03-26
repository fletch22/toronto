import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import ActionInvoker from '../../../actions/ActionInvoker';
import Connector from './DnConnectorNexus';

class DnConnector extends SvgComponent {

  afterMount(dom) {

    // c.lo(this.drag, 'td: ');

    let hasBeenTriggered = false;

    // NOTE: It's ok if arrow head is sticky. Add code to make it disappear on mouseup!!!!!!!!!!

    d3.select(dom)
      .on('mousemove', () => {
        c.l('Mouse moving...');

        d3.event.preventDefault();
        d3.event.stopPropagation();

        // dom.dispatchEvent(new Event('mousedown'));
        // const mousedownEvent = new Event('mousedown'); //document.createEventObject(window.event);
        // mousedownEvent.button = 1;  // left button is down
        // dom.fireEvent('mousedown', mousedownEvent);
        // nodeSelection.dispatch('mousedown');
        // dragThing.dispatch('start');

        const event = d3.event;

        if (!hasBeenTriggered) {
          const mousedownEvent = document.createEvent('MouseEvent');
          mousedownEvent.initMouseEvent(
            'mousedown', true, true, window, 0,
            event.screenX, event.screenY, event.clientX, event.clientY,
            event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
            0, null);
          dom.dispatchEvent(mousedownEvent);
          hasBeenTriggered = true;
          d3.select(dom).on('mousemove', null);
        }
      });
  }

  render() {
    return (
      <g ref="rootGroup">
        <rect ref="rect" width="50" height="32.5" fill="green" stroke="yellow" />
      </g>
    );
  }
}

DnConnector.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.number,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object,
  onMouseOverConnector: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  // const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(state);

  // c.lo(ownProps, 'ownProps: ');

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps) };
};

// const onMouseOverConnector = (ownProps, newSelection, propertyName) => {
//   return (dispatch, getState) => {
//     const state = getState();
//
//     const mergedProps = _.cloneDeep(ownProps);
//     mergedProps.selectedViewModel[propertyName] = newSelection;
//
//     const props = mapStateToProps(state, mergedProps);
//
//     // ActionInvoker.invoke(dispatch, stateUpdateSelectChange, { viewId: ownProps.selectedViewModel.id, propertyName, newValue: newSelection, needsSaving: props.needsSaving });
//   };
// };

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    // onMouseOverConnector: (event) => {
    //   const value = event.target.dataset.id;
    //   dispatch(onMouseOverConnector());
    // }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnector);


export default DnConnector;
