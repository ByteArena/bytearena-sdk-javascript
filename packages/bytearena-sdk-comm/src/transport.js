import net from 'net';

const NEW_LINE = '\n';
const ENCODING = 'utf8';
const METHOD_HANDSHAKE = 'Handshake';
const METHOD_MUTATION = 'Mutation';

const socket = new net.Socket();

export function wrapInTransport(agentid, method, payload) {
  return { agentid, method, payload }
};

export function connect(host, port) {
  return socket.connect(port, host);
}

export function sendHandshake(client, agentid, version) {
  const payload = JSON.stringify(wrapInTransport(agentid, METHOD_HANDSHAKE, {version}));

  client.write(payload + NEW_LINE, ENCODING)
}

export function sendMutations(client, agentid, mutations) {
  const json = JSON.stringify(wrapInTransport(agentid, METHOD_MUTATION, {mutations}));

  client.write(json + NEW_LINE, ENCODING);
}
