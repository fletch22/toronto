import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WidthProvider as widthProvider } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
const ReactGridLayoutInitialized = widthProvider(ReactGridLayout);
import '../../../../css/f22-react-grid-layout.css';
import graphTraversal from '../../../state/graphTraversal';
import crudActionCreator from '../../../actions/crudActionCreator'

class GridLayout extends React.Component {

  generateLayout() {
    const items = [{
      id: 'test',
      isDraggable: true,
      isResizable: true,
      items: 20,
      rowHeight: 30,
      cols: 12
    }, {
      isDraggable: true,
      isResizable: true,
      items: 20,
      rowHeight: 30,
      cols: 12
    }];

    return _.map(items, (item, i) => {
      const w = Math.ceil(Math.random() * 4);
      const y = Math.ceil(Math.random() * 4) + 1;
      return { x: i * 2 % 12, y: Math.floor(i / 6) * y, w, h: y, i: i.toString() };
    });
  }

  generateDOM() {
    const layout = this.generateLayout();
    return _.map(layout, (item, i) => {
      return (<div key={i} data-grid={item}><span className="text">{i}</span></div>);
    });
  }

  render() {
    return (
      <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange} { ...this.props }>
        {this.generateDOM()}
      </ReactGridLayoutInitialized>
    );
  }
}

GridLayout.propTypes = {
  id: PropTypes.any,
  pageChildren: PropTypes.array,
  onLayoutChange: PropTypes.func
};


const mapStateToProps = (state, ownProps) => {
  const appContainerModel = state.model.appContainer;
  const object = graphTraversal.find(appContainerModel, ownProps.id);

  // const layout = _.cloneDeep(ownProps.layout);
  console.log('Firefight in daggas');
  const layout = ownProps.layout;

  return {
    layout
  };
};

const translateAndSaveLayout = (layout, ownProps) => {

  // console.log(JSON.stringify(ownProps));
  //
  // if (Array.isArray(layout)) {
  //
  // } else {
  //   ownProps.pageChildren = [];
  // }

  // const saveLayout = (dispatch, state) => {
  //
  //   // const jsonStateOld = JSON.stringify(state);
  //   // const stateNew = JSON.parse(jsonStateOld);
  //   // const promise = appContainerService.addAppAsync(stateNew, jsonStateOld, label);
  //   //
  //   // promise.catch((error) => {
  //   //   modalDispatch.dispatchErrorModal(error, 'There was an error creating the app.', dispatch);
  //   // });
  //
  //   return promise;
  // };
  //
  // return crudActionCreator.invoke(saveLayout);
  // ViewModelCopyEditor.createUpdate(dispatch, ownProps, containerService.createOrUpdate);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayoutChange: (layout) => {
      // NOTE: Attempt to avoid misrendering.
      console.log('layout changed.');
      window.dispatchEvent(new Event('resize'));

      // dispatch(translateAndSaveLayout(layout, ownProps));
      // console.log(JSON.stringify(layout));
      // if (!_.isEqual(layout, ownProps.layout)) {
      //   dispatch(actionProcessRootLayout(ownProps.pageId, layout));
      // }
    }
  };
};

GridLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(GridLayout);

export default GridLayout;

