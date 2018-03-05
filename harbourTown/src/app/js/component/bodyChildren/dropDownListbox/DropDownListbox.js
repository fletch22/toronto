import React, { PropTypes } from 'react';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';

class DropDownListbox extends BodyChild {
  render() {
    const style = JSON.parse(this.props.model.style) || {};

    return (
      <div id={this.props.model.id} style={style}>
        <select>
          <option>(select)</option>
        </select>
      </div>
    );
  }
}

DropDownListbox.propTypes = {
  model: PropTypes.object
};

export default DropDownListbox;


