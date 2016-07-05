import React, { PropTypes } from 'react';
import '../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { connect } from 'react-redux';
import orbModelTraversal from '../../state/orbModelTraversal';
import { actionUpdateOrbPropertyNoPersist } from '../../actions/index';

class HeaderWithClose extends React.Component {

  constructor(props) {
    super(props);
    this.handleLabelKeyPress = this.handleLabelKeyPress.bind(this);
  }

  handleLabelKeyPress(event) {
    if (event.key === 'Enter') {
      this.refs.label.blur();
    }
  }

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <input type="text" ref="label" value={this.props.label} onChange={this.props.onChangeTest} onBlur={this.props.onChangeLabel} className="darkTextbox" onKeyUp={this.handleLabelKeyPress} />
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
  label: PropTypes.string,
  id: PropTypes.any,
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onLabelKeyPress: PropTypes.func,
  onChangeTest: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeTest: (event) => {
      dispatch(actionUpdateOrbPropertyNoPersist(ownProps.id, 'label', event.target.value));
    }
  };
};

HeaderWithClose = connect(
  null,
  mapDispatchToProps
)(HeaderWithClose);

export default HeaderWithClose;



