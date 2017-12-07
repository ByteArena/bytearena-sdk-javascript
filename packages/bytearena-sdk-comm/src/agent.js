const events = ['raw', 'error', 'perception', 'welcome', 'end']

export default class Agent {
  constructor(onActions) {
    this._callbacks = {};

    this._callbacks['actions'] = onActions;

    this.takeActions = this.do;
  }

  on(key, fn) {
    if (typeof key !== 'string') {
      throw new Error('key must be a string');
    }

    if (typeof fn !== 'function') {
      throw new Error('fn must be a function');
    }

    if (events.indexOf(key) === -1) {
      throw new Error(`Cannot subscribe to "${key}": unsupported event`);
    }

    this._callbacks[key] = fn
  }

  _call(key, ...args) {
    if (this._has(key)) {
      this._callbacks[key](...args)
    }
  }

  _has(key) {
    return typeof this._callbacks[key] === 'function';
  }

  do(actions) {
    if (typeof actions !== 'object' || typeof actions.length === 'undefined') {
      throw new Error('actions must be an array')
    }

    this._call('actions', actions)
  }
}
