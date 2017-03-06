import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import ModelPropTextInput from '../../../../editors/ModelPropTextInput';
import 'rc-menu/assets/index.css';
import HeaderMenu from './HeaderMenu';
import { actionAppToggleMenu } from '../../../../../actions/dashboard/app';
import graphTraversal from '../../../../../state/graphTraversal';

class Header extends React.Component {

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <ModelPropTextInput modelNodeId={this.props.modelNodeId} propertyName="label" onBlur={this.props.onChangeLabel} value={this.props.headerTextValue} />
          </div>
        </div>
        <div className="header-right">
          <button type="button" className="fa fa-ellipsis-v button-ellipses-v" aria-label="Close" onClick={this.props.onClickOpenMenu} />
          <HeaderMenu isShowingHeaderMenu={this.props.isShowingHeaderMenu} modelNodeId={this.props.modelNodeId} parentModelNodeId={this.props.parentModelNodeId} />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  headerTextValue: PropTypes.string,
  modelNodeId: PropTypes.any,
  parentModelNodeId: PropTypes.number,
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onClickOpenMenu: PropTypes.func,
  isShowingHeaderMenu: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const appContainerDom = state.dom.view.appContainer;
  const model = graphTraversal.find(appContainerDom.children, ownProps.modelNodeId);

  return {
    isShowingHeaderMenu: model.isShowingHeaderMenu
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickOpenMenu: () => {
      dispatch(actionAppToggleMenu(ownProps.modelNodeId));
    }
  };
};

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default Header;


