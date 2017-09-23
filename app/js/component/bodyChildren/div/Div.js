import React, { PropTypes } from 'react';
import BodyChild from '../BodyChild';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import ComponentChild from '../ComponentChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';

class Div extends BodyChild {
  render() {
    const style = JSON.parse(this.props.style);

    if (!!this.props.parentHoveredOver) {
      style.border = '2px solid red';
    }

    return DragAndDropMaker.connectRender(this.props, (
      <div id={this.props.id} className="flex-bc" onClick={this.componentSelect} style={style}>
        {
          this.props.children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
          )
        }
      </div>
    ));
  }
}

Div.PropTypes = {
  dnd: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  let parentHoveredOver;

  // c.l(`This div should have red border: ${ownProps.viewModel.id}: ${ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId}`);

  if (ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId) {
    const dnd = state.dragNDrop;
    parentHoveredOver = {
      id: dnd.parentOfHoverOverId,
      targetChildDropIndex: dnd.targetChildDropIndex
    };
  }

  return {
    children: ownProps.viewModel.viewModel.children,
    isSelected: ownProps.viewModel.isSelected,
    style: ownProps.viewModel.viewModel.style,
    parentHoveredOver
  };
};

Div = connect(
  mapStateToProps,
  null
)(Div);

Div = DragAndDropMaker.connect(Div);

export default Div;


