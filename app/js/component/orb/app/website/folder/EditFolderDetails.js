import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import containerService from '../../../../../service/component/containerService';
import graphTraversal from '../../../../../state/graphTraversal';
import ViewModelCopyEditor from '../../../ViewModelCopyEditor';
import TextInput from '../../../../view/TextInput';
import EditorIdDisplay from '../../EditorIdDisplay';
import EditorButtons from '../../EditorButtons';

class EditFolderDetails extends ViewModelCopyEditor {

  render() {
    return (
      <div>
        <EditorIdDisplay model={this.props.model} />
        <div className="row">
          <div className="col-lg-2 editor-label-container"><label>Label:</label></div>
          <div className="col-lg-10">
            <TextInput id={this.props.id} path={'model.label'} value={this.props.label} />
          </div>
        </div>
        <EditorButtons onSaveClick={this.props.onSaveClick} onCancelClick={this.props.onCancelClick} />
      </div>
    );
  }
}

EditFolderDetails.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  label: PropTypes.string, // NOTE: Label attribute on object.
  model: PropTypes.object, // NOTE: Model object carrying attribute values
  parentModelId: PropTypes.number, // NOTE: Parent to model object.
  modelNodeId: PropTypes.any, // NOTE: Model ID - if new this value will be a UUID.
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const view = graphTraversal.find(state, ownProps.id);

  return {
    label: view.model.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    ViewModelCopyEditor.createUpdate(dispatch, ownProps, containerService.createOrUpdate);
  }
});

EditFolderDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditFolderDetails);

export default EditFolderDetails;
