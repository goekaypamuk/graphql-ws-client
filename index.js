class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

module.exports =  (params) => {
    require('isomorphic-fetch');
    if (!params.url) throw new Error('Missing url parameter');
    const WebSocket = require('ws');
    const webSocket = new WebSocket(params.url, "graphql-ws");
    let counter = 0;
    const globalDefs = {};
    let deferred = new Deferred();

    webSocket.on('open', () => {
        deferred.resolve(true);
    });

    webSocket.on('close', () => {
        deferred = new Deferred();
    });

    webSocket.on('message',(data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'data') {
            globalDefs[msg.id].resolve(msg.payload)
        }
        if (msg.type === 'error') {
            console.log(msg)
        }
    });


    return {
        query: async (query, variables, onResponse) => {
            await deferred.promise;
            const def = new Deferred();
            const id = ++counter;
            globalDefs[id] = def;
            webSocket.send(JSON.stringify({
                type: 'start',
                id: id,
                payload: {
                    variables: variables,
                    query: query
                }
            }));
            return def.promise;
        }
    }
};