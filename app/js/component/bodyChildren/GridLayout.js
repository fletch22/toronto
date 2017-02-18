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
      <div className={wrapperClass} key={gridItem.i} data-grid={gridItem} style={{ padding: '0px', margin: '0px' }}>
        <ComponentChild id={viewModel.id} viewModel={viewModel} isSelected={viewModel.isSelected} />
      </div>
    );
  }

  render() {
    let wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';
    wrapperClass += ' grid-layout';

    const generate = () => {
      const layoutMinionViewModels = this.props.children;
      // const layoutMinionViewModels = this.props.viewModel.viewModel.children;
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

    return (
      <div data-type={ComponentTypes.Layout}
        className={wrapperClass}
        data-viewid={this.props.viewModel.id}
        onClick={this.props.onClick}
        style={{ height: '100%', width: '100%', minHeight: '50px', backgroundColor: 'white', padding: '0px', margin: '0px', verticalAlign: 'top' }}
      >
        <ReactGridLayoutInitialized onLayoutChange={this.props.onLayoutChange} margin={[0, 0]} containerPadding={[0, 0]} rowHeight={35}>
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
  onLayoutChange: PropTypes.func,
  onClick: PropTypes.func,
  vm: PropTypes.object,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  // NOTE: Attempt to avoid misrendering.
  GridLayout.refreshGrid();

  return {
    viewModel: ownProps.viewModel,
    children: ownProps.viewModel.viewModel.children,
    isStatic: ownProps.viewModel.isStatic,
    isSelected: ownProps.viewModel.isSelected
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayoutChange: (layout) => {
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


