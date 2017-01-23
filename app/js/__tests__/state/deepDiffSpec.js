import deepDiff from 'deep-diff';
import { assert, expect } from 'chai';
import sampleObject from './sampleObject';

describe('Two objects when compared with deep diff', () => {

  it('should have a difference if they are different.', () => {

    const lhs = { };
    const rhs = { dog: 'golden retriever' };
    const differences = deepDiff(lhs, rhs);

    expect(differences).to.not.equal(undefined);
  });

  it('should have no difference if they are the same.', () => {

    const lhs = sampleObject.getInstance();
    const rhs = sampleObject.getInstance();
    const differences = deepDiff(lhs, rhs);

    expect(differences).to.equal(undefined);
  });

  it('should have found a difference when a property is deleted.', () => {
    const lhs = sampleObject.getInstance();
    const rhs = Object.assign([], sampleObject.getInstance());

    delete rhs[0].name;

    const differences = deepDiff(lhs, rhs);

    expect(differences).to.not.equal(undefined);
    expect(differences.length).to.equal(1);
  });

  it('should have executed deep diff check with speed.', () => {
    const lhs = sampleObject.getInstance()[0];
    const rhs = Object.assign({}, sampleObject.getInstance()[0]);

    delete rhs.name;
    delete rhs.jewelry[0].hand.ring;
    rhs.children = [];
    rhs.tags.push('banana');
    rhs.spa.virtue.faithfulness = 'maybe';
    rhs.brickleberry = {
      id: 525,
      type: 'berry',
      weather: 'sunshine',
      temp: 70,
      arm: {
        id: 534,
        type: 'appendage',
        hand: {
          id: 435,
          type: 'manipulator',
          finger: [
            {
              id: 63,
              type: 'gripper',
              scissors: 'fiskers'
            }
          ]
        }
      }
    };
    rhs.friends[1].id = 4;

    const maxCount = 100;
    const start = new Date().getMilliseconds();
    for (let i = 0; i < maxCount; i++) {
      const differences = deepDiff(lhs, rhs);
      break;
    }
    const end = new Date().getMilliseconds();

    console.debug(end - start);
    assert(end - start < 60, 'Elapsed time for deepDiff should be acceptable amount.');
  });
});
