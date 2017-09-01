import React from 'react';
import BodyChild from '../BodyChild';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import ComponentChild from '../ComponentChild';

class Div extends BodyChild {
  render() {
    const style = JSON.parse(this.props.style);

    return (
      <div id={this.props.id} className="flex-bc" onClick={this.componentSelect} style={style}>
        {
          this.props.children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    children: ownProps.viewModel.viewModel.children,
    isSelected: ownProps.viewModel.isSelected,
    style: ownProps.viewModel.viewModel.style
  };
};

Div = connect(
  mapStateToProps,
  null
)(Div);

export default Div;


