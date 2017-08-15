import net from 'net';
import readline from 'readline';

export const connect = (port, host, agentid) => {

    const wrapInTransport = function(type, payload) {
        return {
            AgentId: agentid,
            Type: type,
            Payload: payload,
        };
    };

    function onConnect(client, resolve, reject) {

        const json = JSON.stringify(wrapInTransport("Handshake", {
            Greetings: 'Hello from ' + agentid + ' !'
        }));

        client.write(json + "\n", "utf8", function() {
            // handshake successful

            readline.createInterface(client, client)
                .on('line', function(data) {

                    const json = data.toString();
                    const decoded = JSON.parse(json);

                    if('Method' in decoded) {
                        // Request emitted by server; not handling session yet (one way messaging, like pubsub)
                        if(decoded.Method === 'tick') {
                            const tickturn = parseInt(decoded.Arguments[0]);
                            const senses = decoded.Arguments[1];
                            cbktickrequested(tickturn, senses);
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

            let cbktickrequested = function() {}; // no-op

            resolve({
                sendMutations(turn, mutations) {
                    return new Promise(function(resolve, reject) {
                        const json = JSON.stringify(wrapInTransport('Mutation', {
                            Turn: turn,
                            Mutations: mutations
                        }));

                        client.write(json + "\n", "utf8", function(err) {
                            resolve();
                        });
                    });
                },
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
