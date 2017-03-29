import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import ModelPropTextInput from '../../../../../editors/ModelPropTextInput';
import 'rc-menu/assets/index.css';
import HeaderMenu from './HeaderMenu';
import { actionUpdateViewPropertyValue } from '../../../../../../actions/index';

class Header extends React.Component {

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <ModelPropTextInput
              viewModelId={this.props.viewModel.id}
              propertyName="label"
              value={this.props.headerTextValue}
              isTextInputFieldVisible={this.props.isTextInputFieldVisible}
              onBlur={this.props.onChangeLabel}
            />
          </div>
        </div>
        <div className="header-right">
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
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onClickOpenMenu: PropTypes.func,
  isShowingHeaderMenu: PropTypes.bool,
  isTextInputFieldVisible: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  return {
    headerTextValue: ownProps.viewModel.viewModel.label,
    isShowingHeaderMenu: ownProps.viewModel.isShowingHeaderMenu,
    isTextInputFieldVisible: ownProps.viewModel.isTextInputFieldVisible
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickOpenMenu: () => {
      dispatch(actionUpdateViewPropertyValue(ownProps.viewModel.id, 'isShowingHeaderMenu', !ownProps.isShowingHeaderMenu, true));
    }
  };
};

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default Header;


