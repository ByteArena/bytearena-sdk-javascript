import net from 'net';
import readline from 'readline';

export const version = {
  PROTOCOL_VERSION_CLEAR_BETA: "clear_beta",
  PROTOCOL_VERSION_CLEAR_V1: "clear_v1",
};

export const connect = (port, host, agentid) => {

    const wrapInTransport = (type, payload) => ({
        agentid: agentid,
        type: type,
        payload: payload,
    });

    function onConnect(client, resolve, reject) {

        function sendMoves(mutations) {
            return new Promise(function(resolve, reject) {
                const json = JSON.stringify(wrapInTransport('Mutation', {
                    mutations: mutations
                }));

                client.write(json + "\n", "utf8", resolve);
            });
        }

        const json = JSON.stringify(wrapInTransport("Handshake", {
            version: version.PROTOCOL_VERSION_CLEAR_BETA,
        }));

        client.write(json + "\n", "utf8", function() {
            // handshake successful

            let cbktickrequested = function() {}; // no-op

            readline.createInterface(client, client)
                .on('line', function(data) {

                    const json = data.toString();
                    const decoded = JSON.parse(json);

                    if('method' in decoded) {
                        // Request emitted by server; not handling session yet (one way messaging, like pubsub)
                        if(decoded.method === 'tick') {
                            cbktickrequested({ perception: decoded.arguments[1], sendMoves });
                        } else {
                            throw new Error('Undefined method requested from server : ' + decoded.method);
                        }
                    } else {
                        throw new Error('Invalid message received from server :' + json);
                    }
                });

            resolve({
                onTick(cbk) {
                    cbktickrequested = cbk;
                },

                onClose(cb) {
                    client.on("close", cb)
                },
            });
        });
    }

    return new Promise(function(resolve, reject) {
        const client = new net.Socket();
        client.connect(port, host, onConnect.bind(null, client, resolve, reject));
    });
};
