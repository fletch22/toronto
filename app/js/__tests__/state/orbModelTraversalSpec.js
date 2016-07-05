import orbModelTraversal from '../../state/orbModelTraversal';
import { expect } from 'chai';

describe('OrbModelTraversal', () => {

  const state = {
    id: 'banana',
    children: [
      { id: 'bar', parentId: 'banana' },
      {
        id: 'foo', parentId: 'banana', children: [
          { id: 'mango', parentId: 'foo' },
          {
            id: 'apple', parentId: 'foo', children: [
              {
                id: 'seed', parentId: 'apple', children: [
                  { id: 'section0', parentId: 'seed' },
                  { id: 'section1', parentId: 'seed' },
                  { id: 'section2', parentId: 'seed' },
                  { id: 'section3', parentId: 'seed' },
                  { id: 'section4', parentId: 'seed' },
                  { id: 'section5', parentId: 'seed' },
                  { id: 'section6', parentId: 'seed' },
                  { id: 'section7', parentId: 'seed' },
                  { id: 'section8', parentId: 'seed' },
                  { id: 'section9', parentId: 'seed' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  it('should find an object correctly.', () => {
    const object = orbModelTraversal.find(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('foo');
  });

  it('should not find an object that does not exist.', () => {
    const object = orbModelTraversal.find({}, 'foo');

    expect(object).is.equal(undefined);
  });

  it('should find parent object.', () => {
    const object = orbModelTraversal.findParent(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('banana');
  });

  it('should find parent object.', () => {
    const object = orbModelTraversal.findParent(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('banana');
  });

  it('should find parent object quickly.', () => {
    let object;

    const startDate = new Date().getTime();
    for (let i = 0; i < 100; i++) {
      object = orbModelTraversal.findParent(state, 'section7');
    }
    const endDate = new Date().getTime();

    console.log(`Elapsed millis: ${endDate - startDate}`);

    expect(object.id).to.equal('seed');
    expect(endDate - startDate < 10).to.equal(true);
  });

});
