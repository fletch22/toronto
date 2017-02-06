import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import ComponentChild from '../../component/bodyChildren/ComponentChild';

class LayoutMinion extends React.Component {

  render() {
    const children = (this.props.viewModel.viewModel.children) ? this.props.viewModel.viewModel.children : [];

    let style;
    if (this.props.viewModel.viewModel.style === '') {
      style = { padding: '0', margin: '0', width: '100%' };
    } else {
      style = JSON.parse(this.props.viewModel.viewModel.style);
    }

    return (
      <div className="layout-minion" data-viewid={this.props.id} onClick={this.props.onClick} style={style}>
          {
            children.map((child) =>
              <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
            )
          }
      </div>
    );
  }
}

LayoutMinion.propTypes = {
  id: PropTypes.string,
  viewModel: PropTypes.object,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  foo: PropTypes.any
};

const mapDispatchToProps = (dispatch) => {
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

