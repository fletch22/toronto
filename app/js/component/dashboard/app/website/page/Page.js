import React, { PropTypes } from 'react';
import Island from '../../../../dashboard/Island';
import { connect } from 'react-redux';
import Header from '../../../../dashboard/app/website/page/header/Header';
import crudComponentOperations from '../../../../CrudOperations';
import graphTraversal from '../../../../../state/graphTraversal';

class Page extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];

    return (
      <div>
        <div className="dashboard-item dashboard-webpage col-sm-12">
          <Header headerTextValue={this.props.pageName} modelNodeId={this.props.id} parentModelNodeId={this.parentId} onClickClose={this.props.onClickRemove} onChangeLabel={this.props.onChangeLabel} />
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

Page.propTypes = {
  id: PropTypes.any.isRequired,
  parentId: PropTypes.number.isRequired,
  pageName: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(React.PropTypes.object),
  onClickRemove: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function remove(component) {
  return crudComponentOperations.removeNode(component);
}

function changePageName(component, newLabelValue) {
  return crudComponentOperations.updateProperty(component, 'pageName', newLabelValue);
}

const mapStateToProps = (state, ownProps) => {
  const appContainerModel = state.model.appContainer;
  const object = graphTraversal.find(appContainerModel, ownProps.id);

  return {
    pageName: object.pageName
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickRemove: () => {
      dispatch(remove(ownProps));
    },
    onChangeLabel: (event) => {
      dispatch(changePageName(ownProps, event.target.value));
    }
  };
};

Page = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);

export default Page;
