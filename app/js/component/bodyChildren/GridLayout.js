import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WidthProvider as widthProvider } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
const ReactGridLayoutInitialized = widthProvider(ReactGridLayout);
import '../../../css/f22-react-grid-layout.css';
import ComponentTypes from '../../domain/component/ComponentTypes';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import LayoutMinion from './LayoutMinion';

class GridLayout extends React.Component {

  constructor() {
    super();
    this.div = null;
  }

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
  generateRandomDOM() {
    const layout = this.generateLayout();
    return _.map(layout, (item, i) => {
      return this.generateMinion(i, item);
    });
  }

  generateMinion(viewModel, gridItem) {
    return (
      <div key={gridItem.i} data-grid={gridItem}>
        <LayoutMinion viewModel={viewModel} />
      </div>
    );
  }

  render() {
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    const generate = (layoutMinionViewModels) => {
      return _.map(layoutMinionViewModels, (layoutMinViewModel, i) => {
        const viewModel = layoutMinViewModel.viewModel;
        const gridItem = { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
        return this.generateMinion(layoutMinViewModel, gridItem);
      });
    };

    return (
      <div data-type={ComponentTypes.Layout} className={wrapperClass} data-viewid={this.props.viewModel.id} onClick={this.props.onClick} style={{ minHeight: '100px' }}>
        <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange} { ...this.props }>
          { generate(this.props.viewModel.viewModel.children)}
        </ReactGridLayoutInitialized>
      </div>
    );
  }
}

GridLayout.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.any,
  isSelected: PropTypes.bool,
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

