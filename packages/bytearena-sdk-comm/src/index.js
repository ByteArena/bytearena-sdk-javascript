import process from 'process'
import readline from 'readline';

import version from './versions'
import {sendActions, sendHandshake, connect as transportConnect} from './transport'
import Agent from './agent'

const METHOD_PERCEPTION = 'perception'
const METHOD_WELCOME = 'welcome'

export function connect() {
  const port = process.env.PORT;
  const host = process.env.HOST;
  const agentid = process.env.AGENTID;

  const socket = transportConnect(host, port)

  function onActions(batch) {
    sendActions(socket, agentid, batch)
  }

  const stream = new Agent(onActions)

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

      stream._call('raw', decoded)

      if('method' in decoded) {

        if(decoded.method === METHOD_PERCEPTION) {
          stream._call('perception', decoded.payload)
        } else if(decoded.method === METHOD_WELCOME) {
          stream._call('welcome', decoded.payload)
        }

      } else {
        throw new Error('Invalid message received from server :' + json);
      }

    });

  return stream;
}
