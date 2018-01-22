import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'rc-menu/assets/index.css';
import ModelPropTextInput from '../../../../editors/ModelPropTextInput';
import HeaderMenu from './HeaderMenu';
import { actionUpdateViewPropertyValue } from '../../../../../actions/index';

class Header extends React.Component {
  render() {
    return (
      <div className="container-orb col-md-12">
        <div className="header-left col-md-11 no-padding">
            <ModelPropTextInput
              viewModelId={this.props.viewModel.id}
              propertyName="label"
              value={this.props.headerTextValue}
              isTextInputFieldVisible={this.props.isTextInputFieldVisible}
              onBlur={this.props.onChangeLabel}
            />
        </div>
        <div className="header-right col-md-1">
          <button type="button" className="fa fa-ellipsis-v button-ellipses-v" aria-label="Close" onClick={this.props.onClickOpenMenu} />
          <HeaderMenu isShowingHeaderMenu={this.props.isShowingHeaderMenu}
            viewModelId={this.props.viewModel.id}
            modelId={this.props.viewModel.viewModel.id}
            parentModelNodeId={this.props.viewModel.viewModel.parentId}
          />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  viewModel: PropTypes.object,
  headerTextValue: PropTypes.string,
  isShowingHeaderMenu: PropTypes.bool,
  isTextInputFieldVisible: PropTypes.bool,
  onChangeLabel: PropTypes.func,
  onClickOpenMenu: PropTypes.func
};

const mapStateToProps = (state, ownProps) => (
  {
    headerTextValue: ownProps.viewModel.viewModel.label,
    isShowingHeaderMenu: ownProps.viewModel.isShowingHeaderMenu,
    isTextInputFieldVisible: ownProps.viewModel.isTextInputFieldVisible
  }
);

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickOpenMenu: () => {
    dispatch(actionUpdateViewPropertyValue(ownProps.viewModel.id, 'isShowingHeaderMenu', !ownProps.isShowingHeaderMenu, true));
  }
});

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default Header;


