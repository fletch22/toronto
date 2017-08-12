import React from 'react';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';

class DropDownListbox extends BodyChild {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style);

    return (
      <div id={this.props.id} onClick={this.componentSelect} style={style} title={this.props.viewModel.viewModel.name}>
        <select>
          <option>(select)</option>
        </select>
      </div>
    );
  }
}

DropDownListbox = connect(
  null,
  null
)(DropDownListbox);

export default DropDownListbox;


