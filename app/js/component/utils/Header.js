import React, { PropTypes } from 'react';
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import { connect } from 'react-redux';
import '../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import F22Input from '../orb/F22Input';
import 'rc-menu/assets/index.css';
import animate from 'css-animation';

class Header extends React.Component {

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <F22Input modelNodeId={this.props.modelNodeId} propertyName="label" onBlur={this.props.onChangeLabel} value={this.props.headerTextValue} />
          </div>
        </div>
        <div className="header-right">
          <button type="button" className="fa fa-ellipsis-v button-ellipses-v" aria-label="Close" onClick={this.props.onClickOpenMenu} />
          <div className="header-menu">
            <Menu>
              <MenuItem>1</MenuItem>
              <SubMenu title="2">
                <MenuItem>2-1</MenuItem>
              </SubMenu>
            </Menu>
          </div>
        </div>
      </div>

    );
  }
}

//  <button type="button" className="fa fa-ellipsis-v button-ellipses-v" aria-label="Close" onClick={this.props.onClickClose} />

Header.propTypes = {
  headerTextValue: PropTypes.string,
  modelNodeId: PropTypes.any,
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onClickOpenMenu: PropTypes.func
};

function jackson() {
  console.log('Clicked ellipse.');
}

const mapDispatchToProps = () => {
  return {
    onClickOpenMenu: () => {
      jackson();
    }
  };
};

Header = connect(
  null,
  mapDispatchToProps
)(Header);

export default Header;


