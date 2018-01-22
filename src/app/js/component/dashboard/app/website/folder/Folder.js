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
            onChangeLabel={this.props.onChangeLabel}
          />
          {
            children.map((child) =>
              <Island key={child.id} child={child} parentId={this.props.viewModel.id} />
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
  onChangeLabel: PropTypes.func
};

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
