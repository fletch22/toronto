import React, { PropTypes } from 'react';
import Island from '../../../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import crudComponentOperations from '../../../../CrudOperations';
import viewModelCreator from '../../../../../component/utils/viewModelCreator';

class Page extends React.Component {
  render() {
    const children = (this.props.children) ? this.props.children : [];

    return (
      <div>
        <div className="dashboard-item dashboard-webpage col-sm-12">
          <Header viewModel={this.props.viewModel}
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

Page.propTypes = {
  id: PropTypes.any.isRequired,
  viewModel: PropTypes.object,
  pageName: PropTypes.string,
  children: PropTypes.arrayOf(React.PropTypes.object),
  onChangeLabel: PropTypes.func
};

function changePageName(dispatch, ownProps) {
  viewModelCreator.update(dispatch, ownProps.viewModel);
}

const mapStateToProps = (state, ownProps) => {
  return {
    pageName: ownProps.viewModel.pageName
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeLabel: () => {
      changePageName(dispatch, ownProps);
    }
  };
};

Page = connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);

export default Page;
