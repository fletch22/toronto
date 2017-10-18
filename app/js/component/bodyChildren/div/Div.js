import React, { PropTypes } from 'react';
import BodyChild from '../BodyChild';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import ComponentChild from '../ComponentChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import DropMarker from '../DropMarker';

class Div extends BodyChild {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const style = JSON.parse(this.props.style);

    if (!!this.props.parentHoveredOver) {
      style.border = '2px solid red';
    }

    style.display = this.props.visibility ? style.display : 'none';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.id} className="flex-bc" onClick={this.componentSelect} style={style}>
        {
          this.props.children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
          )
        }
        <DropMarker ownerId={this.props.id} />
      </div>
    ));
  }
}

Div.PropTypes = {
  dnd: PropTypes.object,
  visibility: PropTypes.boolean
};

const mapStateToProps = (state, ownProps) => {
  let parentHoveredOver;

  // c.l(`This div should have red border: ${ownProps.viewModel.id}: ${ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId}`);

  if (ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId) {
    const dnd = state.dragNDrop;
    parentHoveredOver = {
      id: dnd.parentOfHoverOverId,
      indexChildTarget: dnd.indexChildTarget
    };
  }

  return {
    children: ownProps.viewModel.viewModel.children,
    isSelected: ownProps.viewModel.isSelected,
    style: ownProps.viewModel.viewModel.style,
    parentHoveredOver,
    visibility: ownProps.viewModel.visibility
  };
};

Div = connect(
  mapStateToProps,
  null
)(Div);

Div = DragAndDropMaker.connectDragAndDrop(Div);

export default Div;


