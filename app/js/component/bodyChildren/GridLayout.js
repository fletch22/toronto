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
import ComponentChild from './ComponentChild';
import actionComponentCreatorHandler from '../../reducers/actionComponentCreatorHandler';
import layoutMinionModelFactory from '../../domain/component/layoutMinionModelFactory';
import viewModelCreator from '../../component/utils/viewModelCreator';

class GridLayout extends React.Component {

  static updateChildrenLayout(parentViewModel, layoutGridItems, dispatch) {

    layoutGridItems.forEach((gridItem) => {
      const layoutMinion = GridLayout.findAssociatedViewModel(gridItem, parentViewModel.viewModel.children);

      if (layoutMinion) {
        const model = layoutMinion.viewModel;
        model.height = gridItem.h;
        model.width = gridItem.w;
        model.x = gridItem.x;
        model.y = gridItem.y;
        viewModelCreator.update(dispatch, layoutMinion, parentViewModel.id);
      } else {
        throw new Error('Not yet implemented create function in updateChildrenLayout.');
        // model = layoutMinionModelFactory.createInstance(parentViewModel.viewModel.id, gridItem.i, gridItem.h, gridItem.w, gridItem.x, gridItem.y);
      }
    });
  }

  // static updateChildLayout(model, gridItem) {
  //   // const model = layoutMinionModelFactory.createInstance(ownProps.selectedChildModelId, 'foo', "1", "1", "0", "0");
  //   // viewModelCreator.create(dispatch, model, ownProps.selectedChildViewId);
  // }

  static findAssociatedViewModel(gridItem, siblings) {
    return _.find(siblings, (layoutMinion) => {
      return layoutMinion.viewModel.key === gridItem.i;
    });
  }

  generateMinion(viewModel, gridItem) {
    const wrapperClass = (viewModel.isSelected) ? 'body-child-selected' : '';

    return (
      <div className={wrapperClass} key={gridItem.i} data-grid={gridItem}>
        <ComponentChild id={viewModel.id} viewModel={viewModel} isSelected={viewModel.isSelected} />
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
      c.lo(layout, 'layout changed: ');

      GridLayout.updateChildrenLayout(ownProps.viewModel, layout, dispatch);

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

