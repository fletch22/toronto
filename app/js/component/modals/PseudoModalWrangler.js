import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PseudoModal from '../../component/modals/PseudoModal';

class PseudoModalWrangler extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.pseudoModals.map(() =>
            <PseudoModal />
          )
        }
      </div>
    );
  }
}

PseudoModalWrangler.propTypes = {
  pseudoModals: PropTypes.arrayOf(React.PropTypes.object)
};

const mapStateToProps = (state) => {
  const pseudoModals = (state.dom.pseudoModals) ? state.dom.pseudoModals : [{}];

  return {
    pseudoModals
  };
};

PseudoModalWrangler = connect(
  mapStateToProps,
  null
)(PseudoModalWrangler);

export default PseudoModalWrangler;
