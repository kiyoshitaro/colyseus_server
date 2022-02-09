import { Room, Client } from "colyseus";
import BattleStateHandler from './BattleStateHandler';
import { IRoomOptions, IMessage, IAction, IPlayer } from '../types';
export default class BattleRoom extends Room<BattleStateHandler> {
    handleMessage = (message: IMessage) => {
        this.broadcast(message.type, message);
    };

    // HANDLER game loop
    onGameLoop = () => {
        this.state.update();
    }

    onCreate(options: IRoomOptions) {

        this.setState(new BattleStateHandler(this.handleMessage));

        // call update function from entities in gameloop
        this.setSimulationInterval(() => this.onGameLoop());

        this.onMessage('*', (client: Client, type: string | number, action: IAction) => {
            const playerId = client.sessionId;
            // Validate which type of message is accepted
            switch (type) {
                case 'pick':
                case 'boost':
                case 'attack':
                    this.state.playerAddAction({
                        playerId,
                        ...action,
                    });
                    break;
                default:
                    break;
            }
        });
    }

    onJoin(client: Client, options: IPlayer) {
        this.state.playerJoin(client.sessionId, options);
        if (this.state.players.size === 2) {
            // this.state.currentTurn = client.sessionId;
            this.lock();
        }
    }

    onLeave(client: Client) {
        this.state.playerLeave(client.sessionId);
    }


}
