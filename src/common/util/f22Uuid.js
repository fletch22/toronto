import uuid from 'node-uuid';

class F22Uuid {

  // function 'v1' will give us a good uuid but it won't be lexigraphically ascending. Reason: https://tools.ietf.org/html/rfc4122#section-4.1.2
  // This will swap the fields so that when we sort, the most recent id will be in the expected place.
  // See this comment from node-uuid author 'Broofa',
  //
  // 'RFC 4122 specifies an explicit ordering of the fields - http://tools.ietf.org/html/rfc4122#section-4.1.2 - that puts the low bytes of the timestamp
  // at the front of the string. I forget the rational for this - something to do with putting the most-likely-to-change fields at the front of the
  // string to improve string comparison performance, iirc. If you want to sort by timestamp, you'll need to swap the 1st and 3rd fields (separated by '-'),
  // then order lexicographically.'
  generate() {
    const id = uuid.v1();
    return `u${id.replace(/^(.{8})-(.{4})-(.{4})/, '$3-$2-$1')}`;
  }
}

export default new F22Uuid();
