import React from 'react';
import { connect } from 'react-redux';
import 'css/modules/time-travel-toolbar';

class TimeTravelNavBar extends React.Component {

  render() {

    let displayCss = 'none';
    if (this.props.show
    && window.showTimeTravelNavBar) {
      displayCss = 'block';
    }

    return (
      <div style={{ display: displayCss }}>
        <div className="time-travel-toolbar">
          <button className="nav-buttons">&lt;</button>
          <button className="nav-buttons">0</button>
          <button className="nav-buttons">&gt;</button>
        </div>
        <div className="modal-backdrop"></div>
      </div>
    );
  }
}

TimeTravelNavBar.propTypes = {
  show: React.PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    show: state.dom.view.timeTravelNavBar.show
  };
};


TimeTravelNavBar = connect(
  mapStateToProps,
  null
)(TimeTravelNavBar);

export default TimeTravelNavBar;
