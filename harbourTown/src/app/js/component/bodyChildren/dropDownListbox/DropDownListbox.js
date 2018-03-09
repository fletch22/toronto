import React, { PropTypes } from 'react';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';
import restService from '../../../service/restService';
import { actionSetCollection } from '../../../actions/bodyChildren/';

class DropDownListbox extends BodyChild {

  componentDidMount() {
    restService.getOptionCollection(this.props.model.collectionCallName)
    .then((result) => {
      c.lo(result, 'result: ');
      this.context.store.dispatch(actionSetCollection(this.props.model.id, result));
    });
  }

  render() {
    const style = JSON.parse(this.props.model.style) || {};

    let options = null;
    if (!!this.props.model.collection) {
      options = this.props.model.collection.map(option => (<option value={option.value} key={option.value}>{option.text}</option>));
    }

    return (
      <div id={this.props.model.id} style={style}>
        <select>
          <option>(select one)</option>
          {
            options
          }
        </select>
      </div>
    );
  }
}

DropDownListbox.propTypes = {
  model: PropTypes.object,
  options: PropTypes.object
};

export default DropDownListbox;


