import React, { PropTypes } from 'react';
import BodyChild from '../BodyChild';
import '../../../../css/f22-react-grid-layout.css';
import ComponentChild from '../ComponentChild';

class Div extends BodyChild {
  render() {
    const children = (this.props.model.children) ? this.props.model.children : [];
    const style = JSON.parse(this.props.model.style);

    return (
      <div id={this.props.model.id} className="flex-bc" style={style}>
        {
          children.map((child) =>
            <ComponentChild key={child.id} model={child} />
          )
        }
      </div>
    );
  }
}

Div.propTypes = {
  model: PropTypes.object
};

export default Div;


