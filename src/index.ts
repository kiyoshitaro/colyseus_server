/**
 * IMPORTANT: 
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Arena
 * 
 * If you're self-hosting (without Arena), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options 
 */
// import { listen } from "@colyseus/arena";
// // Import arena config
// import arenaConfig from "./arena.config";
// // Create and listen on 2567 (or PORT environment variable.)
// listen(arenaConfig);


import express from 'express';
import http from 'http';
import { Server } from "colyseus";
import serveIndex from 'serve-index';
import path from 'path';
import { WebSocketTransport } from "@colyseus/ws-transport"
import { monitor } from "@colyseus/monitor";
import dotenv from 'dotenv';
// import { LobbyRoom, RelayRoom } from 'colyseus';
import { ChatRoom } from "./rooms/01-chat-room";
import BattleRoom from "./rooms/BattleRoom";
import { RoomType } from './types';
// import { MongooseDriver } from "@colyseus/mongoose-driver"


dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log(process.env.PORT);
const app = express();
app.use('/', serveIndex(path.join(__dirname, '..', "static"), { 'icons': true }))
// app.use(express.static(path.join(__dirname, "..", "..", "client", "dist")));
app.use('/colyseus', monitor());

const server = http.createServer(app);

// Transport
// http server instance to re-use for the WebSocket server. Useful when you'd like to use Express along with Colyseus
const gameServer = new Server({
    transport: new WebSocketTransport({ server }),
    // presence: new RedisPresence(),
    // driver: new MongooseDriver(),

    // verifyClient: function (info, next) {
    //     return
    //     // validate 'info'
    //     //
    //     // - next(false) will reject the websocket handshake
    //     // - next(true) will accept the websocket handshake
    // }
});

// Define a new type of room for the matchmaker.
// Rooms are not created during .define() and upon client request
// options will contain the merged values when the same room handler multiple times 
// gameServer.define("lobby", LobbyRoom);

// gameServer.define("relay", RelayRoom, { maxClients: 4 })
//     .enableRealtimeListing();

gameServer.define(RoomType.CHAT, ChatRoom)
    // .sortBy({ clients: -1 })
    .enableRealtimeListing();

// gameServer.define(RoomType.CHAT, ChatRoom, {
//     custom_options: "you can use me on Room#onCreate"
// });

gameServer.define(RoomType.BATTLE_ROOM, BattleRoom)
    .enableRealtimeListing();
gameServer.listen(parseInt(process.env.PORT));
console.log(`Listening on ${process.env.PORT}`)
