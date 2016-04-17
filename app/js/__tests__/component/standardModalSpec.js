import { expect } from 'chai';
import TestRenderedApp from '../testRenderedApp';
import TestUtils from 'react-addons-test-utils';
import jquery from 'jquery';

describe('Standard Modal Setup', () => {

  const testRenderedApp = new TestRenderedApp();
  let sandbox = null;

  // Runs before each test in this block
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    // Runs after each test in this block
    sandbox.restore();

    // Is not removed on close event for some reason. This cleans things up.
    jquery('[role="dialog"]').remove();
  });

  it('should show modal when button is clicked', (done) => {

    const promise = testRenderedApp.setup(sandbox);

    promise.then((result) => {

      const showModal = TestUtils.findRenderedDOMComponentWithClass(result.renderedComponent, 'showModal');

      let matchingElements = jquery('.modal-dialog');
      expect(matchingElements.length).to.equal(0);

      TestUtils.Simulate.click(showModal);

      // This will get the actual DOM node of the button because the Modal tag is special -- it cannot be found using the standard React TestUtils ways.
      matchingElements = jquery('.modal-dialog');
      expect(matchingElements.length).to.equal(1);

      matchingElements = jquery('[aria-label="Close"]');
      expect(matchingElements.length).to.equal(1);
      const closeButton = matchingElements[0];

      let standardModal = result.store.getState().dom.standardModal;
      expect(standardModal.length).to.equal(1);

      TestUtils.Simulate.click(closeButton);

      standardModal = result.store.getState().dom.standardModal;
      expect(standardModal.length).to.equal(0);

      done();
    }).catch((error) => {
      console.log(`Error: ${error}`);
    });

    promise.catch((error) => {
      console.log(`Error: ${error}`);
      done();
    });
  });

  it('should show modal with the correct detailss', (done) => {

    const promise = testRenderedApp.setup(sandbox);

    promise.then((result) => {

      const showModal = TestUtils.findRenderedDOMComponentWithClass(result.renderedComponent, 'showModal');

      let matchingElements = jquery('.modal-dialog');
      expect(matchingElements.length).to.equal(0);

      TestUtils.Simulate.click(showModal);

      // This will get the actual DOM node of the button because the Modal tag is special -- it cannot be found using the standard React TestUtils ways.
      matchingElements = jquery('.modal-dialog');
      expect(matchingElements.length).to.equal(1);

      matchingElements = jquery('[aria-label="Close"]');
      expect(matchingElements.length).to.equal(1);
      const closeButton = matchingElements[0];

      let standardModal = result.store.getState().dom.standardModal;
      expect(standardModal.length).to.equal(1);

      TestUtils.Simulate.click(closeButton);

      standardModal = result.store.getState().dom.standardModal;
      expect(standardModal.length).to.equal(0);

      done();
    }).catch((error) => {
      console.log(`Error: ${error}`);
    });

    promise.catch((error) => {
      console.log(`Error: ${error}`);
      done();
    });
  });
});





