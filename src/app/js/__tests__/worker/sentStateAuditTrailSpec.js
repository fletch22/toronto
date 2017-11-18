import SentStateAuditTrail from '../../worker/sentStateAuditTrail';
import { expect } from 'chai';

describe('The sent state audit trail object', () => {

  let sentStateAuditTrail;

  beforeEach(() => {
    sentStateAuditTrail = new SentStateAuditTrail();
  });

  function createMultiArray(numItems) {
    const result = [];
    for (let i = 0; i < numItems; i++) {
      result.push({ clientId: i.toString(), foo: 'bar' });
    }

    return result;
  }

  it('should faithfully capture the sent ids', () => {
    const sendArray1 = [{ clientId: 'asdf' }];

    sentStateAuditTrail.collect(sendArray1);

    expect(sentStateAuditTrail.collection.length).to.equal(1);

    const sendArray2 = createMultiArray(100);
    sentStateAuditTrail.collect(sendArray2);

    expect(sentStateAuditTrail.collection.length).to.equal(2);
    expect(sentStateAuditTrail.collection[1].length).to.equal(100);

    expect(sentStateAuditTrail).to.not.equal(null);
  });

  it('should gather the most recent ids correctly', () => {

    const sendArray1 = [{ clientId: 'asdf' }];

    sentStateAuditTrail.collect(sendArray1);

    expect(sentStateAuditTrail.collection.length).to.equal(1);

    const sendArray2 = createMultiArray(99);
    sentStateAuditTrail.collect(sendArray2);

    const gathered = sentStateAuditTrail.gatherRecent();

    // Note: The threshold is 100. So if there are 2 elements in the array and one of them has 99 subarray elements, the
    // the other array will be sucked in as well - giving us a total of 2 top-level arrays.
    expect(gathered.length).to.equal(2);

    const arrayOfIds = gathered[1];
    expect(arrayOfIds.length).to.equal(1);

    const id1 = arrayOfIds[0];
    expect(id1).to.equal('asdf');
  });
});


