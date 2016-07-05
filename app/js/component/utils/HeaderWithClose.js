import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import F22Input from '../orb/F22Input';

class HeaderWithClose extends React.Component {

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <F22Input modelNodeId={this.props.modelNodeId} propertyName="label" onBlur={this.props.onChangeLabel} value={this.props.headerTextValue} />
          </div>
        </div>
        <div className="header-right">
          <button type="button" className="fa fa-times button-close" aria-label="Close" onClick={this.props.onClickClose}>
          </button>
        </div>
      </div>
    );
  }
}

HeaderWithClose.propTypes = {
  headerTextValue: PropTypes.string,
  modelNodeId: PropTypes.any,
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func
};

export default HeaderWithClose;



