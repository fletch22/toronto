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
import update from 'react-addons-update';

class GridLayout extends React.Component {

  static refreshGrid() {
    window.setTimeout(() => {
      console.log('Dispatching resize event.');
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
    let wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';
    wrapperClass += ' grid-item';

    const generate = () => {
      const layoutMinionViewModels = this.props.children;
      const isStatic = this.props.isStatic;

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

    return (
      <div data-type={ComponentTypes.Layout} className={wrapperClass} data-viewid={this.props.viewModel.id} onClick={this.props.onClick} style={{ minHeight: '100px' }}>
        <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange}>
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
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  GridLayout.refreshGrid();

  const viewModel = graphTraversal.find(state, ownProps.id);
  // const children = graphTraversal.find(state, ownProps.id);

  c.l('Mapping state to props...');
  const children = [].concat(viewModel.viewModel.children);
  // const children = update(viewModel.viewModel.children, { $push: [] });

  return {
    children,
    isStatic: viewModel.isStatic
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


