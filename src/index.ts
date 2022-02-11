import express from 'express';
import http from 'http';
import { Server } from "colyseus";
import serveIndex from 'serve-index';
import path from 'path';
import { WebSocketTransport } from "@colyseus/ws-transport"
import { monitor } from "@colyseus/monitor";
import dotenv from 'dotenv';
// import { LobbyRoom, RelayRoom } from 'colyseus';
import BattleRoom from "./rooms/pvm/BattleRoom";
import { RoomType } from './types';
import { MongooseDriver } from "@colyseus/mongoose-driver"


dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
console.log(process.env.PORT);
const app = express();
app.use('/', serveIndex(path.join(__dirname, '..', "static"), { 'icons': true }));
app.use('/', express.static(path.join(__dirname, '..', "static")));

// app.use(express.static(path.join(__dirname, "..", "..", "client", "dist")));
app.use('/colyseus', monitor());

const server = http.createServer(app);

// Transport
// http server instance to re-use for the WebSocket server. Useful when you'd like to use Express along with Colyseus
const gameServer = new Server({
    transport: new WebSocketTransport({ server }),
    // presence: new RedisPresence(),
    driver: new MongooseDriver(process.env.MONGO_URI),
});

gameServer.define(RoomType.BATTLE_ROOM, BattleRoom)
    .enableRealtimeListing();
gameServer.listen(parseInt(process.env.PORT));
console.log(`Listening on ${process.env.PORT}`)
