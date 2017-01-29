import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BodyChildrenGenerator from './BodyChildrenGenerator';
import graphTraversal from '../../state/graphTraversal';
import util from '../../util/util';
import 'css/modules/time-travel-toolbar';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import SelectedContextToolbar from './SelectedContextToolbar';

class BodyChildren extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return (
      <div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td className="body-children-toolbar-col">
                <SelectedContextToolbar selectedTypeLabel={this.props.selectedTypeLabel} selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />
              </td>
              <td className={wrapperClass} style={{ minWidth: '1300px', maxWidth: '1300px' }} data-viewid={this.props.viewModel.id} onClick={this.props.selectChild}>
                {
                  children.map((child) =>
                    <BodyChildrenGenerator key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
                  )
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

BodyChildren.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  selectedTypeLabel: PropTypes.string,
  selectChild: PropTypes.func,
  isSelected: PropTypes.bool,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const parent = graphTraversal.find(state, ownProps.id);
  const stateChildren = parent.viewModel.children;

  // NOTE: I'm assuming this will update all descendents. The alternative is to detecting differences in the
  // arrays. If arrays are diff, then update. If this is not performant, will need to implement a comparison at each node where children are
  // rendered. If the array lengths are different, then will use [].concat to force update.
  const children = [].concat(stateChildren);

  let selectedTypeLabel;
  let selectedChildModelId;
  const selectedChildViewId = (parent.selectedChildViewId) ? parent.selectedChildViewId : parent.id;
  if (selectedChildViewId) {
    const viewModel = graphTraversal.find(state, selectedChildViewId);

    selectedChildModelId = viewModel.viewModel.id;
    selectedTypeLabel = viewModel.viewModel.typeLabel;

    // c.lo(viewModel, 'viewModel: ');
    // c.lo(selectedChildViewId, 'selectedChildViewId: ');
    // c.lo(selectedChildModelId, 'selectedChildModelId: ');
    // c.lo(selectedTypeLabel, 'selectedTypeLabel: ');
  }

  return {
    children,
    selectedChildViewId,
    selectedChildModelId,
    selectedTypeLabel,
    isSelected: selectedChildViewId === ownProps.id
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // This and the tags above can be abstracted into it's own tag.
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(event.currentTarget.dataset.viewid));
    }
  };
};

BodyChildren = connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyChildren);

export default BodyChildren;
