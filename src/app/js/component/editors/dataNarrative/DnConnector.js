import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { actionUpdateViewPropertyValue } from '../../../actions';
import { actionSetDataNarrativeConnectorAfterDrag } from '../../../actions/bodyChildrenEditor/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor';

class DnConnector extends SvgComponent {

  static getDragNDropFns(dispatch, ownProps) {
    return {
      beforeDrag: (data) => {
        dispatch(actionUpdateViewPropertyValue(data.id, 'viewModel.viewCoordinatesDragOffset', data.viewModel.viewCoordinatesDragOffset, true));
      },
      onDrag: (data) => {
        const x = data.viewModel.viewCoordinates.x - data.viewModel.viewCoordinatesDragOffset.x;
        const y = data.viewModel.viewCoordinates.y - data.viewModel.viewCoordinatesDragOffset.y;

        dispatch(actionSetDataNarrativeViewProps(data.id, data.viewModel.zoom, x, y, false));
      },
      afterDrag: (data) => {
        dispatch(actionSetDataNarrativeConnectorAfterDrag(data.id, data.viewModel.zoom, data.viewModel.viewCoordinates.x, data.viewModel.viewCoordinates.y));
      }
    };
  }

  afterMount(dom) {
    let hasBeenTriggered = false;
    let hasBeenDropeed = false;

    // NOTE: It's ok if arrow head is sticky. Add code to make it disappear on mouseup!!!!!!!!!!
    const selection = d3.select(dom);
    selection
      .on('mousemove', () => {
        c.l('Mouse moving...');

        d3.event.preventDefault();
        d3.event.stopPropagation();

        selection.on('mouseup', () => {
          c.l('Mouseup!');
        });

        // if (!hasBeenTriggered) {
        //   const mousedownEvent = document.createEvent('MouseEvent');
        //   const event = d3.event;
        //   mousedownEvent.initMouseEvent(
        //     'mousedown', true, true, window, 0,
        //     event.screenX, event.screenY, event.clientX, event.clientY,
        //     event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
        //     0, null);
        //   dom.dispatchEvent(mousedownEvent);
        //   hasBeenTriggered = true;
        //   d3.select(dom).on('mousemove', null);
        // }
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

  return { ...fns, ...DnConnector.getDragNDropFns(dispatch, ownProps) };
};

DnConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnector);


export default DnConnector;
