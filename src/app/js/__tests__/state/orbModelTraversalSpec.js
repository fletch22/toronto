import graphTraversal from '../../../../common/state/graphTraversal';
import { expect } from 'chai';

describe('GraphTraversal', () => {

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
    const object = graphTraversal.find(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('foo');
  });

  it('should not find an object that does not exist.', () => {
    const object = graphTraversal.find({}, 'foo');

    expect(object).is.equal(undefined);
  });

  it('should find parent object.', () => {
    const object = graphTraversal.findParent(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('banana');
  });

  it('should find parent object.', () => {
    const object = graphTraversal.findParent(state, 'foo');

    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('banana');
  });

  it('should find parent object quickly.', () => {
    let object;

    const startDate = new Date().getTime();
    for (let i = 0; i < 100; i++) {
      object = graphTraversal.findParent(state, 'section7');
    }
    const endDate = new Date().getTime();

    expect(object.id).to.equal('seed');
    expect(endDate - startDate < 15).to.equal(true);
  });

  it('should find an object correctly..', () => {

    let object;
    const start = new Date();
    for (let i = 0; i < 1000; i++) {
      object = graphTraversal.find(state, 'section0');
    }
    const end = new Date();

    const elapsed = end - start;

    expect(elapsed).is.lessThan(35);
    expect(object).is.not.equal(null);
    expect(typeof object).is.equal('object');
    expect(object.id).to.equal('section0');
  });
});
