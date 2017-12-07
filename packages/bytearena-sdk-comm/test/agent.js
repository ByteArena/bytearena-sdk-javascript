const assert = require('assert');

const Agent = require('../lib/agent').default;

describe('Agent', () => {
  const onActions = Function();

  it('should have a constructor', () => {
    assert(typeof Agent.constructor === 'function');
  });

  it('should have a callable on method', () => {
    const agent = new Agent(onActions);

    assert(typeof agent.on === 'function');
  });

  it('should have a callable do method', () => {
    const agent = new Agent(onActions);

    assert(typeof agent.do === 'function');
  });

  it('should have an alias between takeActions and do', () => {
    const agent = new Agent(onActions);

    assert(
      agent.do === agent.takeActions,
      'agent.do and agent.takeActions doesn\'t refer to the same function'
    );
  });

});
