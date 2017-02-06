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
import graphTraversal from '../../state/graphTraversal';
import actionComponentCreator from '../../reducers/actionComponentCreatorHandler';

class GridLayout extends React.Component {

  // NOTE: This is trick to get the grid to render correctly after load.
  static refreshGrid() {
    window.setTimeout(() => {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('resize', true, false);
      window.dispatchEvent(evt);
    }, 200);
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
    let wrapperClass = (this.props.isSelected) ? 'body-child-selected' : 'grid-layout';
    wrapperClass += ' grid-item';

    const generate = () => {
      const layoutMinionViewModels = this.props.viewModel.viewModel.children;
      const isStatic = this.props.viewModel.isStatic;

      return _.map(layoutMinionViewModels, (layoutMinViewModel) => {
        const viewModel = layoutMinViewModel.viewModel;
        const gridItem = { h: parseInt(viewModel.height, 10),
          w: parseInt(viewModel.width, 10),
          x: parseInt(viewModel.x, 10),
          y: parseInt(viewModel.y, 10),
          i: isStatic ? `${viewModel.key}-static` : viewModel.key,
          static: isStatic
        };
        return this.generateMinion(layoutMinViewModel, gridItem);
      });
    };

    let rowHeight = 35;

    if (this.props.ancestorCount > 2) {
      rowHeight = rowHeight - (0.1 * this.props.ancestorCount);
    }

    return (
      <div data-type={ComponentTypes.Layout}
        className={wrapperClass}
        data-viewid={this.props.viewModel.id}
        onClick={this.props.onClick}
        style={{ height: '100%', width: '100%', minHeight: '50px', backgroundColor: 'white', padding: '5px', margin: '0px', verticalAlign: 'top' }}
      >
        <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange} margin={[1, 2]} containerPadding={[1, 0]} rowHeight={rowHeight}>
          { generate()}
        </ReactGridLayoutInitialized>
      </div>
    );
  }
}

GridLayout.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.any,
  isSelected: PropTypes.bool,
  isStatic: PropTypes.bool,
  children: PropTypes.array,
  onLayoutChange: PropTypes.func,
  ancestorCount: PropTypes.number,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  GridLayout.refreshGrid();
  const viewModel = graphTraversal.find(state, ownProps.id);

  let ancestorCount = 1;

  let children = null;
  let isStatic = false;
  let isSelected = false;
  if (viewModel) {
    children = [].concat(viewModel.viewModel.children);
    isStatic = viewModel.isStatic;
    isSelected = viewModel.isSelected;

    // TEST
    let parentNodeId = viewModel.parentId;
    while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
      const parentNode = graphTraversal.find(state, parentNodeId);
      if (!parentNode) {
        throw new Error('Encountered problem trying to find web page root node.');
      }
      parentNodeId = parentNode.parentId;
      ++ancestorCount;
    }
    c.l('Ancestors: ' + ancestorCount);
    // TEST
  }

  return {
    children,
    isStatic,
    isSelected,
    ancestorCount
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayoutChange: (layout) => {
      // NOTE: Attempt to avoid misrendering.
      LayoutService.handleLayoutChange(ownProps.viewModel, layout, dispatch);
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


