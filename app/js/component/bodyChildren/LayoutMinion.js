import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';

class LayoutMinion extends React.Component {

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

  // generate(layoutMinionViewModels) {
  //   return _.map(layoutMinionViewModels, (layoutMinViewModel, i) => {
  //     const viewModel = layoutMinViewModel.viewModel;
  //     const gridItem = { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
  //     c.lo(gridItem, 'gridItem: ');
  //     return this.generateMinion(gridItem.i, gridItem);
  //   });
  // }

  generate(layoutMinionViewModel) {
    const viewModel = layoutMinionViewModel.viewModel;
    const gridItem = { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
    c.lo(gridItem, 'gridItem: ');
    // return this.generateMinion(gridItem.i, gridItem);
    return gridItem;
  }

  render() {
    const gridItem = this.generate(this.props.viewModel);

    return (
      <div>
        <span className="text">{gridItem.i}</span>
        <div className="layout-minion" data-view-id={gridItem.i} onClick={this.props.onClick}>
          <div style={{ width: '100%' }}>foo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo
            choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo
            choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo choofoo choo choo choo
          </div>
        </div>
      </div>
    );
  }
}

LayoutMinion.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(event.currentTarget.dataset.viewid));
    }
  };
};

LayoutMinion = connect(
  null,
  mapDispatchToProps
)(LayoutMinion);

export default LayoutMinion;

