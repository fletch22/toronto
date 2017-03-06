import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PropTextInput from '../../../../../../component/editors/PropTextInput';
import Button from '../../../../../bodyChildren/toolbar/Button';
import { actionToggleNewCollectionNameInput } from '../../../../../../actions/wizard/configureDdl/index';
import dataModelModelFactory from '../../../../../../domain/component/dataModelModelFactory';
import viewModelCreator from '../../../../../utils/viewModelCreator';
import { actionUpdatePropertyWithPersist } from '../../../../../../actions/index';

class CreateCollection extends React.Component {
  render() {
    let classes = 'create-collection';
    classes += this.props.visible ? ' create-collection-visible' : '';

    return (
      <div className={classes}>
        <span>New Collection Name:</span>
        <PropTextInput uuid={this.props.newCollectionNameInput.id}
          propertyName="value"
          onBlur={this.props.onBlurNewCollectionName}
          value={this.props.newCollectionNameInputValue}
        />
        <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" />
        <Button faClass="fa-close" onClick={this.props.onClickCancel} tooltipText="Cancel" />
      </div>
    );
  }
}

CreateCollection.propTypes = {
  datastore: PropTypes.any,
  newCollectionNameInput: PropTypes.object,
  newCollectionNameInputValue: PropTypes.string,
  onBlurNewCollectionName: PropTypes.func,
  visible: PropTypes.bool,
  onClickSave: PropTypes.func,
  onClickCancel: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const newCollectionNameInputValue = ownProps.newCollectionNameInput.value;

  return {
    newCollectionNameInputValue
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickCancel: () => {
      dispatch(actionToggleNewCollectionNameInput(ownProps.newCollectionNameInput.id));
    },
    onClickSave: () => {
      const model = dataModelModelFactory.createInstance(ownProps.datastore.viewModel.id, ownProps.newCollectionNameInput.value);

      const successCallback = () => {
        dispatch(actionUpdatePropertyWithPersist(ownProps.newCollectionNameInput.id, 'value', ''));
        dispatch(actionToggleNewCollectionNameInput(ownProps.newCollectionNameInput.id));
      };

      viewModelCreator.create(dispatch, model, ownProps.datastore.id, successCallback);
    }
  };
};

CreateCollection = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCollection);

export default CreateCollection;
