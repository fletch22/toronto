import React, { PropTypes } from 'react';
import Button from '../../../toolbar/Button';
import { connect } from 'react-redux';
import { actionSetSelectValueField, actionSetSelectDisplayField } from '../../../../../actions/wizard/configureDdl/index';

class SelectFieldsToolbar extends React.Component {
  render() {
    return (
      <div className="sel_view_toolbar">
        <Button faClass="fa-id-card-o" disabled={this.props.disableButtons} onClick={this.props.onClickMarkAddAsValueField} tooltipText="Mark the selected item as the identifier value" />
        <Button faClass="fa-text-width" disabled={this.props.disableButtons} onClick={this.props.onClickMarkAsDisplayField} tooltipText="Mark the selected item as the display value" />
      </div>
    );
  }
}

SelectFieldsToolbar.propTypes = {
  wizardViewId: PropTypes.string,
  onClickMarkAddAsValueField: PropTypes.func,
  onClickMarkAsDisplayField: PropTypes.func,
  disableButtons: PropTypes.bool
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickMarkAddAsValueField: () => {
      dispatch(actionSetSelectValueField(ownProps.wizardViewId));
    },
    onClickMarkAsDisplayField: () => {
      dispatch(actionSetSelectDisplayField(ownProps.wizardViewId));
    }
  };
};

SelectFieldsToolbar = connect(
  null,
  mapDispatchToProps
)(SelectFieldsToolbar);

export default SelectFieldsToolbar;
