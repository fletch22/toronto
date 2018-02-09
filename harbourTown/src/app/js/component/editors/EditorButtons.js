import React, { PropTypes } from 'react';

class EditorButtons extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div style={{ display: 'inline', float: 'right' }}>
            <button type="button" onClick={this.props.onSaveClick}>Save</button>
            <button type="button" onClick={this.props.onCancelClick}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

EditorButtons.propTypes = {
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};

export default EditorButtons;
