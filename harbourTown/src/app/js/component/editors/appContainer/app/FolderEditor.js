import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ViewModelCopyEditor from '../../ViewModelCopyEditor';
import PropPathTextInput from '../../PropPathTextInput';
import EditorIdDisplay from '../../EditorIdDisplay';
import EditorButtons from '../../EditorButtons';

import editorValuesPersistence from '../../../../views/dashboard/editorValuesPersistence';

class FolderEditor extends ViewModelCopyEditor {
  render() {
    return (
      <div>
        <EditorIdDisplay model={this.props.model} />
        <div className="row">
          <div className="col-lg-2 editor-label-container"><label>Label:</label></div>
          <div className="col-lg-10">
            <PropPathTextInput id={this.props.id} path={'model.label'} value={this.props.label} />
          </div>
        </div>
        <EditorButtons onSaveClick={this.props.onSaveClick} onCancelClick={this.props.onCancelClick} />
      </div>
    );
  }
}

FolderEditor.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  label: PropTypes.string, // NOTE: Label attribute on object.
  model: PropTypes.object, // NOTE: Model object carrying attribute values
  parentModelId: PropTypes.number, // NOTE: Parent to model object.
  modelNodeId: PropTypes.any, // NOTE: Model ID - if new this value will be a UUID.
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const model = { ...ownProps.model };

  return {
    label: ownProps.model.label,
    model
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveClick: () => {
    editorValuesPersistence.persist(dispatch, ownProps);
  }
});

FolderEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderEditor);

export default FolderEditor;
