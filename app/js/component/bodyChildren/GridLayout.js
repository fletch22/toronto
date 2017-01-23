import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WidthProvider as widthProvider } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
const ReactGridLayoutInitialized = widthProvider(ReactGridLayout);
import '../../../css/f22-react-grid-layout.css';
import ComponentTypes from '../../domain/component/ComponentTypes';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';

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

    // return _.map(items, (item, i) => {
    //   const w = Math.ceil(Math.random() * 4);
    //   const y = Math.ceil(Math.random() * 4) + 1;
    //   return { x: i * 2 % 12, y: Math.floor(i / 6) * y, w, h: y, i: i.toString() };
    // });

    return _.map(items, (item, i) => {
      const w = Math.ceil(3);
      const y = Math.ceil(2);
      return { x: i * 2 % 12, y: Math.floor(i / 6) * y, w, h: y, i: i.toString() };
    });
  }

  generateMinion(i, item) {
    return (
      <div key={i} data-grid={item}>
        <span className="text">{i}</span>
        <div className="layout-minion" data-view-id={i} onClick={this.props.onClick}>
          <div style={{ width: '100%' }}>foo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo
          choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo
          choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo
          </div>
        </div>
      </div>
    );
  }

  generateDOM() {
    const layout = this.generateLayout();
    return _.map(layout, (item, i) => {
      return this.generateMinion(i, item);
    });
  }

  render() {
    return (
      <div data-type={ComponentTypes.Layout} data-viewid={this.props.id} onClick={this.props.onClick}>
        <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange} { ...this.props }>
          {this.generateDOM()}
        </ReactGridLayoutInitialized>
      </div>
    );
  }
}

GridLayout.propTypes = {
  id: PropTypes.any,
  pageChildren: PropTypes.array,
  onLayoutChange: PropTypes.func,
  onClick: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayoutChange: (layout) => {
      // NOTE: Attempt to avoid misrendering.
      console.log('layout changed.');
      window.dispatchEvent(new Event('resize'));
    },
    onClick: (event) => {
      c.lo(event.currentTarget.dataset.viewid);
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(event.currentTarget.dataset.viewid));
    }
  };
};

GridLayout = connect(
  null,
  mapDispatchToProps
)(GridLayout);

export default GridLayout;

