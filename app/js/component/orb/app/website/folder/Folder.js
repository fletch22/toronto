import React, { PropTypes } from 'react';
import Island from '../../../../dashboard/Island';
import { connect } from 'react-redux';
import Header from '../../website/folder/header/Header';
import crudComponentOperations from '../../../../CrudOperations';
import graphTraversal from '../../../../../state/graphTraversal';

class Folder extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];

    return (
      <div>
        <div className="dashboard-item dashboard-webfolder col-sm-12">
          <Header headerTextValue={this.props.label} modelNodeId={this.props.id} parentModelNodeId={this.parentId} onClickClose={this.props.onClickRemoveApp} onChangeLabel={this.props.onChangeLabel} />
          {
            children.map((child) =>
              <Island key={child.id} child={child} />
            )
          }
        </div>
      </div>
    );
  }
}

Folder.propTypes = {
  id: PropTypes.any.isRequired,
  parentId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(React.PropTypes.object),
  onClickRemoveApp: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function remove(component) {
  return crudComponentOperations.removeNode(component);
}

function changeLabel(component, newLabelValue) {
  return crudComponentOperations.updateProperty(component, 'label', newLabelValue);
}

const mapStateToProps = (state, ownProps) => {
  const appContainerModel = state.model.appContainer;
  const object = graphTraversal.find(appContainerModel, ownProps.id);

  return {
    label: object.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickRemoveApp: () => {
      dispatch(remove(ownProps));
    },
    onChangeLabel: (event) => {
      dispatch(changeLabel(ownProps, event.target.value));
    }
  };
};

Folder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder);


export default Folder;
