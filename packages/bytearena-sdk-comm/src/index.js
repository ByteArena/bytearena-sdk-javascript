import net from 'net';
import readline from 'readline';

export const version = {
  PROTOCOL_VERSION_CLEAR_BETA: "clear_beta",
  PROTOCOL_VERSION_CLEAR_V1: "clear_v1",
};

export const connect = (port, host, agentid) => {

    const wrapInTransport = (type, payload) => ({
        AgentId: agentid,
        Type: type,
        Payload: payload,
    });

    function onConnect(client, resolve, reject) {

        function sendMoves(mutations) {
            return new Promise(function(resolve, reject) {
                const json = JSON.stringify(wrapInTransport('Mutation', {
                    Mutations: mutations
                }));

                client.write(json + "\n", "utf8", resolve);
            });
        }

        const json = JSON.stringify(wrapInTransport("Handshake", {
            version: PROTOCOL_VERSION_CLEAR_BETA
        }));

        client.write(json + "\n", "utf8", function() {
            // handshake successful

            let cbktickrequested = function() {}; // no-op

            readline.createInterface(client, client)
                .on('line', function(data) {

                    const json = data.toString();
                    const decoded = JSON.parse(json);

                    if('Method' in decoded) {
                        // Request emitted by server; not handling session yet (one way messaging, like pubsub)
                        if(decoded.Method === 'tick') {
                            cbktickrequested({ perception: decoded.Arguments[1], sendMoves });
                        } else {
                            throw new Error('Undefined Method requested from server : ' + decoded.Method);
                        }
                    } else {
                        throw new Error('Invalid message received from server :' + json);
                    }
                })
                .on('close', function() {
                    // TODO: stop agent
                });

            resolve({
                onTick(cbk) {
                    cbktickrequested = cbk;
                }
            });
        });
    }

    return new Promise(function(resolve, reject) {
        const client = new net.Socket();
        client.connect(port, host, onConnect.bind(null, client, resolve, reject));
    });
};
