import process from 'process'
import readline from 'readline';

import version from './versions'
import {sendMutations, sendHandshake, connect} from './transport'
import GameStream from './stream'

const METHOD_TICK = 'tick'

export default function gameServerConnect() {
  const port = process.env.PORT;
  const host = process.env.HOST;
  const agentid = process.env.AGENTID;

  const socket = connect(host, port)
  const stream = new GameStream()

  socket.on('error', (err) => {

    if (stream._has('error')) {
      stream._call('error', err)
    } else {
      throw err
    }
  });

  socket.on('end', (err) => {

    if (stream._has('end')) {
      stream._call('end')
    } else {
      process.exit(0)
    }
  });

  socket.on('connect', (err) => {
    sendHandshake(socket, agentid, version.PROTOCOL_VERSION_CLEAR_BETA)
  });

  readline.createInterface(socket, socket)
    .on('line', function onGameServerData(data) {
      const json = data.toString();
      const decoded = JSON.parse(json);

      if('method' in decoded) {

        if(decoded.method === METHOD_TICK) {
          stream._call('perception', decoded.arguments[1], (mutations) => sendMutations(socket, agentid, mutations))
        } else {
          throw new Error('Undefined method requested from server : ' + decoded.method);
        }
      } else {
        throw new Error('Invalid message received from server :' + json);
      }

    });

  return stream;
}
