import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WidthProvider as widthProvider } from 'react-grid-layout';
import ReactGridLayout from 'react-grid-layout';
const ReactGridLayoutInitialized = widthProvider(ReactGridLayout);
import '../../../css/f22-react-grid-layout.css';
import ComponentTypes from '../../domain/component/ComponentTypes';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import ComponentChild from './ComponentChild';
import LayoutService from '../../service/component/LayoutChangeService';

class GridLayout extends React.Component {

  generateMinion(viewModel, gridItem) {
    const wrapperClass = (viewModel.isSelected) ? 'body-child-selected' : '';

    return (
      <div className={wrapperClass} key={gridItem.i} data-grid={gridItem}>
        <ComponentChild id={viewModel.id} viewModel={viewModel} isSelected={viewModel.isSelected} />
      </div>
    );
  }

  render() {
    let wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';
    wrapperClass += ' grid-item';

    const generate = (layoutMinionViewModels) => {
      return _.map(layoutMinionViewModels, (layoutMinViewModel, i) => {
        const viewModel = layoutMinViewModel.viewModel;
        const gridItem = { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
        return this.generateMinion(layoutMinViewModel, gridItem);
      });
    };

    // _.map(this.props.viewModel.viewModel.children, (child) =>
    //   <GridLayoutMinion key={child.id} viewModel={child} />)
    // }

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

const mapStateToProps = (state, ownProps) => {
  c.l('Mapping state to props...');
  const pageChildren = [].concat(ownProps.viewModel.viewModel.children);

  return {
    pageChildren
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayoutChange: (layout) => {
      // NOTE: Attempt to avoid misrendering.
      LayoutService.handleLayoutChange(ownProps.viewModel, layout, dispatch);

      window.dispatchEvent(new Event('resize'));
    },
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(event.currentTarget.dataset.viewid));
    }
  };
};

GridLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(GridLayout);

export default GridLayout;

