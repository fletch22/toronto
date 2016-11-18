import React, { PropTypes } from 'react';
import App from '../component/orb/App';
import Website from '../component/orb/app/website/Website';
import { connect } from 'react-redux';

class GeneralOrbComponent extends React.Component {

  render() {
    let component;
    switch (this.props.child.typeLabel) {
      case 'App': {
        component = <App {...this.props.child} />;
        break;
      }
      case 'Website': {
        component = <Website {...this.props.child} />;
        break;
      }
      default:
        component = <div className="container-app col-lg-2">unknown object</div>;
    }

    return (
      <div>
        { component }
      </div>
    );
  }
}

GeneralOrbComponent.propTypes = {
  child: PropTypes.object.isRequired
};

export default GeneralOrbComponent;
