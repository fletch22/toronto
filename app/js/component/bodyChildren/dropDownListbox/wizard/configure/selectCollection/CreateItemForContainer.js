import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PropTextInput from '../../../../../../component/editors/PropTextInput';
import Button from '../../../../../bodyChildren/toolbar/Button';
import { actionToggleNewItemNameInput } from '../../../../../../actions/wizard/configureDdl/index';

class CreateItemForContainer extends React.Component {
  render() {
    let classes = 'create-item-for-collection';
    classes += this.props.visible ? ' create-item-for-collection-visible' : '';

    const newItemNameInputValue = this.props.newItemNameInputValue === null ? '' : this.props.newItemNameInputValue;

    return (
      <div className={classes}>
        <span>New Item Name:</span>
        <PropTextInput uuid={this.props.newItemNameInput.id}
          propertyName="value"
          onBlur={this.props.onBlurNewItemName}
          value={newItemNameInputValue }
        />
        <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" />
        <Button faClass="fa-close" onClick={this.props.onClickCancel} tooltipText="Cancel" />
      </div>
    );
  }
}

CreateItemForContainer.propTypes = {
  viewModel: PropTypes.any,
  newItemNameInput: PropTypes.object,
  newItemNameInputValue: PropTypes.string,
  onBlurNewItemName: PropTypes.func,
  visible: PropTypes.bool,
  onClickSave: PropTypes.func,
  onClickCancel: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const newItemNameInputValue = ownProps.newItemNameInput.value;

  return {
    newItemNameInputValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickCancel: () => {
      dispatch(actionToggleNewItemNameInput(ownProps.newItemNameInput.id));
    }
  };
};

CreateItemForContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateItemForContainer);

export default CreateItemForContainer;
