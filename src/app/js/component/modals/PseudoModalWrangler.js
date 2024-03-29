import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PseudoModal from '../../component/modals/PseudoModal';

class PseudoModalWrangler extends React.Component {
  render() {
    return (
      <div>
      {
        this.props.pseudoModals.map((pseudoModal, index) => {
          return (<PseudoModal id={pseudoModal.id} key={pseudoModal.id} zIndex={index + 1000}
            data={pseudoModal.data} title={pseudoModal.title} viewName={pseudoModal.viewName} className={pseudoModal.className}
          />);
        })
      }
      </div>
    );
  }
}

PseudoModalWrangler.propTypes = {
  pseudoModals: PropTypes.arrayOf(React.PropTypes.object),
  onCloseModal: PropTypes.func
};

const mapStateToProps = (state, props) => {
  let statePseudoModals = state.dom.pseudoModals;
  const oldChildren = JSON.stringify(props.pseudoModals);
  const newChildren = JSON.stringify(state.model.appContainer.children);

  if ((props.pseudoModals && statePseudoModals && props.pseudoModals.length !== statePseudoModals.length)
    || oldChildren !== newChildren) {
    statePseudoModals = [].concat(state.dom.pseudoModals);
  }

  return {
    pseudoModals: statePseudoModals
  };
};

PseudoModalWrangler = connect(
  mapStateToProps,
  null
)(PseudoModalWrangler);

export default PseudoModalWrangler;
