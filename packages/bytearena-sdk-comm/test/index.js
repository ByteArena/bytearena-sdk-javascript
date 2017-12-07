const assert = require('assert');

const index = require('../lib');
const Agent = require('../lib/agent').default;

describe('connect', () => {

  it('should return an agent object', () => {
    const agent = index.connect();

    assert(typeof agent === 'object');
    assert(agent instanceof Agent);
  });

});

