const assert = require('assert');

const {sendActions} = require('../lib/transport');

describe('transport', () => {

  describe('send actions', () => {

    it('should send actions', () => {
      let wrote = false;

      const client = {
        write(payload) {
          assert(typeof payload === 'string');

          const json = JSON.parse(payload);

          assert(json.method === 'Actions');

          wrote = true;
        }
      };

      sendActions(client, 'id', []);

      assert(wrote, 'client did not send any message');
    });

  });
});
