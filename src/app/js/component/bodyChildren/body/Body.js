import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentChild from '../ComponentChild';
import graphTraversal from '../../../../../common/state/graphTraversal';
import '../../../../css/modules/time-travel-toolbar.scss';
import SelectedContextToolbar from '../SelectedContextToolbar';
import DragAndDropMaker from '../../../component/dragAndDrop/DragAndDropMaker';
import DragAndDropUtils from '../../../component/dragAndDrop/DragAndDropUtils';
import BodyChild from '../../bodyChildren/BodyChild';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import { actionUnsetCurrentBody } from '../../../actions/bodyChildrenEditor/index';

class Body extends BodyChild {
  render() {
    const children = (this.props.children) ? this.props.children : [];

    const style = typeof this.props.viewModel.style === 'object' ? JSON.parse(this.props.viewModel.style) : {};

    style.flexGrow = 1;
    style.marginLeft = '4px';
    style.border = this.props.isHoveringOver ? '2px solid red' : style.border;

    let selectedContextToolbar = null;
    if (this.props.selectedViewModel) {
      selectedContextToolbar = (<SelectedContextToolbar selectedViewModel={this.props.selectedViewModel} />);
    }

    return DragAndDropMaker.connectDropRender(this.props, (
      <div className="flex-bc" style={{ height: '100%' }}>
        <div className="body-children-toolbar-col">
          {
            selectedContextToolbar
          }
        </div>
        <div id={this.props.id} style={style} onClick={this.componentSelect} data-f22-component={ComponentTypes.WebPage}>
          {
            children.map((child) =>
              <ComponentChild key={child.id} id={child.id} viewModel={child} />
            )
          }
        </div>
      </div>
    ));
  }
}

Body.propTypes = BodyChild.mergePropTypes({
  selectedViewModel: PropTypes.object,
  selectedChildViewId: PropTypes.string,
  onWillUnmount: PropTypes.func,
  viewModel: PropTypes.object
});

const mapStateToProps = (state, ownProps) => {
  let selectedViewModel;

  const selectedChildViewId = (!!ownProps.selectedChildViewId) ? ownProps.selectedChildViewId : ownProps.id;
  if (selectedChildViewId) {
    selectedViewModel = graphTraversal.find(state, selectedChildViewId);
  }

  return {
    selectedChildViewId,
    selectedViewModel,
    canBeDroppedOn: ownProps.canBeDroppedOn,
    viewModel: ownProps.viewModel
  };
};

Body = DragAndDropMaker.connectDrop(Body);

Body = connect(
  mapStateToProps,
  DragAndDropUtils.mapDispatchToProps
)(Body);

export default Body;
