import React, { PropTypes } from 'react';

class EditorIdDisplay extends React.Component {

  render() {
    const modelIdDisplay = this.props.model.id || '-';
    return (
      <div>
        <div className="row">
          <div className="col-xs-2"><label>ID:</label></div>
          <div className="col-xs-1">{modelIdDisplay}</div>
        </div>
        <div className="row">
          <div className="col-xs-2"><label>Parent ID:</label></div>
          <div className="col-xs-1">{this.props.model.parentId}</div>
        </div>
      </div>
    );
  }
}

EditorIdDisplay.propTypes = {
  model: PropTypes.object
};

export default EditorIdDisplay;
