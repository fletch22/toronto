import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentChild from '../ComponentChild';
import graphTraversal from '../../../state/graphTraversal';
import 'css/modules/time-travel-toolbar';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import SelectedContextToolbar from '../SelectedContextToolbar';

class Body extends React.Component {
  render() {
    const children = (this.props.children) ? this.props.children : [];
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return (
      <div>
        <table style={{ width: '100%', height: '100%' }}>
          <tbody>
            <tr>
              <td className="body-children-toolbar-col">
                <SelectedContextToolbar selectedViewModel={this.props.selectedViewModel} />
              </td>
              <td className={wrapperClass} style={{ width: '1300px', minWidth: '1300px', maxWidth: '1300px' }} data-viewid={this.props.viewModel.id} onClick={this.props.selectChild}>
                {
                  children.map((child) =>
                    <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
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

Body.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  selectedViewModel: PropTypes.object,
  selectChild: PropTypes.func,
  isSelected: PropTypes.bool,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const parent = graphTraversal.find(state, ownProps.id);

  const children = parent.viewModel.children;

  let selectedViewModel;
  const selectedChildViewId = (parent.selectedChildViewId) ? parent.selectedChildViewId : parent.id;
  if (selectedChildViewId) {
    selectedViewModel = Object.assign({}, graphTraversal.find(state, selectedChildViewId));
  }

  return {
    children,
    selectedViewModel,
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

Body = connect(
  mapStateToProps,
  mapDispatchToProps
)(Body);

export default Body;
