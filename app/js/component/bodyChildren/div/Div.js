import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import ComponentChild from '../ComponentChild';

class Div extends React.Component {
  render() {
    const children = (this.props.children) ? this.props.children : [];
    const style = JSON.parse(this.props.viewModel.viewModel.style);
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return (
      <div className={wrapperClass} onClick={this.props.onClick} style={style}>
        {
          children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
          )
        }
      </div>
    );
  }
}

Div.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.any,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => ({
  children: ownProps.viewModel.viewModel.children,
  isSelected: ownProps.viewModel.isSelected
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(ownProps.viewModel.id));
    }
  };
};

Div = connect(
  mapStateToProps,
  mapDispatchToProps
)(Div);

export default Div;


