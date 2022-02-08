import { Room, Client } from "colyseus";
import StateHandler from './StateHandler';
import { Player } from '../entities/Player';
import { IRoomOptions } from '../types';
export default class BattleRoom extends Room<StateHandler> {
    // Colyseus will invoke when creating the room instance
    onCreate(options: IRoomOptions) {
        // initialize empty room state
        this.setState(new StateHandler());

        // Called every time this room receives a "move" message
        this.onMessage("move", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.position.x += data.x;
            player.position.y += data.y;
            console.log(client.sessionId + " at, x: " + player.position.x, "y: " + player.position.y);
        });
        this.onMessage("*", (client, type, message) => {
            //
            // Triggers when any other type of message is sent,
            // excluding "action", which has its own specific handler defined above.
            //
            console.log(client.sessionId, "sent", type, message);
            this.broadcast("action-taken", "an action has been taken!");
        });

    }

    // Rejecting the reconnection after a 20 second timeout
    async onLeave(client: Client, consented: boolean) {
        // flag client as inactive for other users
        this.state.players.get(client.sessionId).connected = false;

        try {
            if (consented) {
                throw new Error("consented leave");
            }

            // allow disconnected client to reconnect into this room until 20 seconds
            await this.allowReconnection(client, 20);

            // client returned! let's re-activate it.
            this.state.players.get(client.sessionId).connected = true;

        } catch (e) {

            // 20 seconds expired. let's remove the client.
            this.state.players.delete(client.sessionId);
        }
    }

    // Called every time a client joins
    onJoin(client: Client, options: any) {
        this.state.players.set(client.sessionId, new Player());

        if (this.state.players.size === 2) {
            // this.state.currentTurn = client.sessionId;
            // this.setAutoMoveTimeout();
            // lock this room for new users
            this.lock();
        }
    }

}
