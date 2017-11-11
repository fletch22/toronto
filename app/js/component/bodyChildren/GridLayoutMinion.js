import React, { PropTypes } from 'react';
import ComponentChild from './ComponentChild';

// Note DEPRECATED. Doesn't work. The React grid can't render.
class GridLayoutMinion extends React.Component {

  render() {
    const getGridItem = (layoutMinViewModel) => {
      const viewModel = layoutMinViewModel.viewModel;
      return { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
    };

    const gridItem = getGridItem(this.props.viewModel);
    const wrapperClass = (this.props.viewModel.isSelected) ? 'body-child-selected' : '';

    return (
      <div className={wrapperClass} key={gridItem.i} data-grid={gridItem}>
        <ComponentChild id={this.props.viewModel.id} viewModel={this.props.viewModel} />
      </div>
    );
  }
}

GridLayoutMinion.propTypes = {
  viewModel: PropTypes.object
};

export default GridLayoutMinion;
