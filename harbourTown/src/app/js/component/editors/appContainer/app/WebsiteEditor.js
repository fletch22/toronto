import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import containerService from '../../../../service/component/containerService';
import graphTraversal from '../../../../../../common/state/graphTraversal';
import ViewModelCopyEditor from '../../ViewModelCopyEditor';
import PropPathTextInput from '../../PropPathTextInput';
import EditorIdDisplay from '../../EditorIdDisplay';
import EditorButtons from '../../EditorButtons';
import editorValuesPersistence from '../../../../views/dashboard/editorValuesPersistence';

class WebsiteEditor extends ViewModelCopyEditor {

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

WebsiteEditor.propTypes = {
  id: PropTypes.string, // NOTE: ID of this editor
  typeLabel: PropTypes.string,
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
    editorValuesPersistence.persist(dispatch, ownProps);
  }
});

WebsiteEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(WebsiteEditor);

export default WebsiteEditor;
