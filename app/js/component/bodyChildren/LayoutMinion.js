import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';

class LayoutMinion extends React.Component {

  generate(layoutMinionViewModel) {
    const viewModel = layoutMinionViewModel.viewModel;
    return { h: parseInt(viewModel.height, 10), w: parseInt(viewModel.width, 10), x: parseInt(viewModel.x, 10), y: parseInt(viewModel.y, 10), i: viewModel.key };
  }

  render() {
    const gridItem = this.generate(this.props.viewModel);

    let label = gridItem.i;
    label = (label.length > 3) ? `${label.substring(0, 2)}...` : label;

    return (
      <div>
        <span className="text">{label}</span>
        <div className="layout-minion" data-viewid={this.props.id} onClick={this.props.onClick}>
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
  id: PropTypes.string,
  viewModel: PropTypes.object,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool
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

