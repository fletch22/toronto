import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionCarouselSlideToIndex } from '../../../../actions/wizard/index.js';

class ButtonWizard extends React.Component {

  render() {
    return (
      <button className="btn btn-default" onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.label}</button>
    );
  }
}

ButtonWizard.propTypes = {
  onClick: PropTypes.func,
  wizardId: PropTypes.string,
  jumpToView: PropTypes.number,
  label: PropTypes.string,
  disabled: PropTypes.bool
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(actionCarouselSlideToIndex(ownProps.wizardId, ownProps.jumpToView));
    }
  };
};

ButtonWizard = connect(
  null,
  mapDispatchToProps
)(ButtonWizard);

export default ButtonWizard;
