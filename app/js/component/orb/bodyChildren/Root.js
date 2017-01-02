import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WidthProvider as widthProvider } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
const ReactGridLayoutInitialized = widthProvider(ReactGridLayout);
import '../../../../css/f22-react-grid-layout.css';

class GridPropertyLayout extends React.Component {

  componentDidMount() {
    console.log('OnComponentDidMount fired.');
    this.forceUpdate();
  }

  onLayoutChange(layout) {
    console.log(JSON.stringify(layout));
  }

  generateLayout() {
    const items = [{
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
      <ReactGridLayoutInitialized onLayoutChange={this.onLayoutChange} { ...this.props }>
        {this.generateDOM()}
      </ReactGridLayoutInitialized>
    );
  }
}

GridPropertyLayout.propTypes = {
  layout: PropTypes.array
};


const mapStateToProps = (state, ownProps) => {
  // const appContainerModel = state.model.appContainer;
  // const object = graphTraversal.find(appContainerModel, ownProps.id);

  return {
    layout: ownProps.layout
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClickRemoveApp: () => {
//       dispatch(remove(ownProps));
//     },
//     onChangeLabel: (event) => {
//       dispatch(changeLabel(ownProps, event.target.value));
//     }
//   };
// };

GridPropertyLayout = connect(
  mapStateToProps,
  null
)(GridPropertyLayout);

export default GridPropertyLayout;

