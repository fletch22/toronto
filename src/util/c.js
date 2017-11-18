class C {

  l(value) {
    console.log(value);
  }

  lo(val, pref) {
    let value = val;
    let prefix = pref;
    let type = typeof value;
    const _ = require('lodash'); // NOTE: This class will break if this line is placed at the top.
    prefix = (!!prefix) ? _.trim(prefix) : '';

    let message;
    if (!!type) {
      if (type === 'string') {
        message = `typeof=${type}`;
        message += `, value=${value}`;
      } else if (type === 'object') {
        if (Array.isArray(value)) {
          type = 'array';
        } else if (typeof value[Symbol.iterator] === 'function') {
          type = 'iterable';
        }

        message = `typeof=${type}`;
        if (type === 'iterable') {
          // NOTE: Spread operator functions thusly: Value is treated as an iterator. next().value is called repeatedly until
          // next() = { value=<foo> done=true }. Each time the resultant value is pushed onto an array..
          value = [].concat(...value);
        }

        let wasErrorThrown = false;
        let json;
        try {
          json = JSON.stringify(value);
        } catch (err) {
          wasErrorThrown = true;
        }
        if (!wasErrorThrown) {
          message += `, json=${json}`;
        }

        if (type === 'object') {
          message += `, enumerableProps:${JSON.stringify(Object.keys(value))}`;
        }
      } else {
        message = `typeof=${typeof val}, ${val}`;
      }
    } else {
      message = 'undefined';
    }

    if (prefix.length > 0) {
      message = `${prefix} -> ${message}`;
    }

    console.log(message);
  }

}

const c = new C();

module.exports.lo = c.lo;
module.exports.l = c.l;
