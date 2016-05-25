import React from 'react';
import StateRollbackModal from '../../component/modals/StateRollbackModal';
import TestUtils from 'react-addons-test-utils';
import Provider from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import defaultState from '../../state/defaultState';
import apps from '../../reducers';
import { createStore } from 'redux';
import { expect } from 'chai';

//const middlewares = [thunk];
//const mockStore = configureMockStore(middlewares);
//
//function setup(state) {
//  const props = {
//    showModal: true
//  };
//
//  const renderer = TestUtils.createRenderer();
//
//  const store = createStore(apps, state);
//
//  renderer.render(
//    <StateRollbackModal store={ store } { ...props } />
//  );
//  const output = renderer.getRenderOutput();
//
//  return {
//    props,
//    output,
//    renderer
//  };
//}
//
//describe('StateRollback Modal Setup', () => {
//
//  it('should show modal when button is clicked', () => {
//
//    const state = defaultState.getInstance();
//    state.dom.modal.stateRollback.showModal = true;
//
//    const { output } = setup(state);
//
//    expect(output.props.showModal).to.equal(true);
//
//    console.log(Object.getOwnPropertyNames(output).sort());
//  });
//});





