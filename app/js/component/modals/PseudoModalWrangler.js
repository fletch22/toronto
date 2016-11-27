import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PseudoModal from '../../component/modals/PseudoModal';

class PseudoModalWrangler extends React.Component {
  render() {
    return (
      <div>
      {
        this.props.pseudoModals.map((pseudoModal, index) => {
          return <PseudoModal id={pseudoModal.id} key={pseudoModal.id} zIndex={1000 + index} data={pseudoModal.data} viewName={pseudoModal.componentViewName} />;
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
    statePseudoModals = update(state.dom.pseudoModals, { $push: [] });
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
