import React from 'react';
// import ButtonReset from '../../time-travel/ButtonReset';
import stateSyncService from '../service/stateSyncService';

class TimeTravelComponent extends React.Component {

  backOneClickHandler() {
    console.log('backOneClickHandler');
    const promise = stateSyncService.getStateMostRecent();

    function success(data) {
      console.log('This is the data...');
      console.log(JSON.stringify(data));
    }

    promise.then(success)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <button onClick={this.backOneClickHandler} className="time-travel">
        &#8249;
      </button>
    );
  }
}

export default TimeTravelComponent;
