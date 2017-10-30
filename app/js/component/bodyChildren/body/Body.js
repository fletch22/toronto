import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentChild from '../ComponentChild';
import graphTraversal from '../../../state/graphTraversal';
import 'css/modules/time-travel-toolbar';
import SelectedContextToolbar from '../SelectedContextToolbar';
import DragAndDropMaker from '../../../component/dragAndDrop/DragAndDropMaker';
import DragAndDropUtils from '../../../component/dragAndDrop/DragAndDropUtils';
import DropMarker from '../../../component/bodyChildren/DropMarker';
import BodyChild from '../../bodyChildren/BodyChild';

class Body extends BodyChild {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const children = (this.props.children) ? this.props.children : [];
    // const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    // c.l(`this.props.isHoveringOver ${this.props.isHoveringOver}`);
    const style = JSON.parse(this.props.style) || {};

    style.flexGrow = 1;
    style.marginLeft = '4px';

    // c.lo(style, 'style: ');

    if (this.props.isHoveringOver) {
      style.border = '2px solid red';
    }

    return DragAndDropMaker.connectDropRender(this.props, (
      <div className="flex-bc" style={{ height: '100%' }}>
        <div className="body-children-toolbar-col">
          <SelectedContextToolbar selectedViewModel={this.props.selectedViewModel} />
        </div>
        <div id={this.props.id} style={style} ref={node => (this.node = node)} onClick={this.componentSelect}>
          {
            children.map((child) =>
              <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
            )
          }
        </div>
        <DropMarker ownerId={this.props.id} />
      </div>
    ));
  }
}

Body.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  selectedViewModel: PropTypes.object,
  selectedChildViewId: PropTypes.string,
  isSelected: PropTypes.bool,
  children: PropTypes.array,
  numChildren: PropTypes.number,
  isHoveringOver: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const children = [].concat(ownProps.viewModel.children);

  let selectedViewModel;
  const selectedChildViewId = (ownProps.selectedChildViewId) ? ownProps.selectedChildViewId : ownProps.id;
  if (selectedChildViewId) {
    selectedViewModel = graphTraversal.find(state, selectedChildViewId);
  }

  return {
    id: ownProps.id,
    children,
    selectedChildViewId,
    selectedViewModel,
    isSelected: selectedChildViewId === ownProps.id,
    isHoveringOver: ownProps.viewModel.id === state.dragNDrop.parentOfHoverOverId,
    numChildren: children.length,
    canBeDroppedOn: ownProps.canBeDroppedOn,
    style: selectedViewModel.viewModel.style
  };
};

Body = DragAndDropMaker.connectDrop(Body);

Body = connect(
  mapStateToProps,
  DragAndDropUtils.mapDispatchToProps
)(Body);

export default Body;
