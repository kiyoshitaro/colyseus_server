// import { Room, Client } from "colyseus.js";
// import { RoomType } from '../types';
// let client = new Client("ws://localhost:2567");
// try {
//     const room = await client.joinOrCreate(RoomType.BATTLE_ROOM, {/* options */ });
//     console.log("joined successfully", room);

// } catch (e) {
//     console.error("join error", e);
// }
import { Room, Client } from "colyseus.js";

export function requestJoinOptions(this: Client, i: number) {
    return { requestNumber: i };
}

export function onJoin(this: Room) {
    console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
        console.log(this.sessionId, "received:", type, message);
    });
}

export function onLeave(this: Room) {
    console.log(this.sessionId, "left.");
}

export function onError(this: Room, err: any) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

export function onStateChange(this: Room, state: any) {
    console.log(this.sessionId, "new state:", state);
}
