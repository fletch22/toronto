import React, { PropTypes } from 'react';
import Island from '../../../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import crudComponentOperations from '../../../../CrudOperations';
import viewModelCreator from '../../../../../component/utils/viewModelCreator';

class Folder extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];

    return (
      <div>
        <div className="dashboard-item dashboard-webfolder col-sm-12">
          <Header viewModel={this.props.viewModel}
            onClickClose={this.props.onClickRemove}
            onChangeLabel={this.props.onChangeLabel}
          />
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
  viewModel: PropTypes.object,
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(React.PropTypes.object),
  onClickRemove: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function remove(component) {
  return crudComponentOperations.removeNode(component);
}

function changeLabel(dispatch, ownProps) {
  viewModelCreator.update(dispatch, ownProps.viewModel);
}

const mapStateToProps = (state, ownProps) => {
  return {
    label: ownProps.viewModel.viewModel.label,
    children: ownProps.viewModel.viewModel.children
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickRemoveApp: () => {
      dispatch(remove(ownProps));
    },
    onChangeLabel: () => {
      changeLabel(dispatch, ownProps);
    }
  };
};

Folder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Folder);


export default Folder;
