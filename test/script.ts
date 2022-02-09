import { Room, Client } from "colyseus.js";


const host = window.document.location.host.replace(/:.*/, '');
const port = process.env.NODE_ENV !== 'production' ? Constants.WS_PORT : window.location.port;
const url = `${window.location.protocol.replace('http', 'ws')}//${host}${port ? `:${port}` : ''}`;


const runtest = async () => {
    var client = new Client("ws://localhost:2567");
    var room = await client.joinOrCreate("battle_room");
}

runtest();
