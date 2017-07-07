import React, { PropTypes } from 'react';
// import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
// import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';

class Submit extends React.Component {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style);
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return (
      <button className={wrapperClass} style={style}>{this.props.label}</button>
    );
  }
}

Submit.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  isSelected: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func
};

// const mapStateToProps = (state, ownProps) => {
//   return {
//     isSelected: ownProps.viewModel.isSelected
//   };
// };
//
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClick: (event) => {
//       event.stopPropagation();
//       dispatch(actionSetCurrentBodyTool(ownProps.id));
//     }
//   };
// };
//
// DropDownListbox = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(DropDownListbox);

export default Submit;


