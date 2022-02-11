import { Room, Client } from "colyseus";
import BattleStateHandler from './BattleStateHandler';
import { IRoomOptions, IMessage, IAction, IPlayer } from '../../types';
import { Monster } from '../../entities';
export default class BattleRoom extends Room<BattleStateHandler> {
    handleMessage = (message: IMessage) => {
        this.broadcast(message.type, message);
    };

    // HANDLER game loop
    // onGameLoop = () => {
    //     this.state.update();
    // }

    onCreate(options: IRoomOptions) {

        this.setState(new BattleStateHandler(this.handleMessage));

        // call update function from entities in gameloop
        // this.setSimulationInterval(() => this.onGameLoop());

        this.onMessage('play', (client: Client, action: IAction) => {
            const playerId = client.sessionId;
            console.log(playerId, "ssss", action.type);
            // Validate which type of message is accepted
            if (this.state.isPlayerTurn) {
                switch (action.type) {
                    case 'pick_character':
                        this.state.playerPickCharacter({
                            playerId,
                            ...action,
                        });
                        break;

                    case 'pick_skill':
                        this.state.playerPickSkill({
                            playerId,
                            ...action,
                        });
                        break;

                    case 'attack':
                        this.state.playerAttack({
                            playerId,
                            ...action,
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    }

    onJoin(client: Client, options: IPlayer) {
        this.state.playerJoin(client.sessionId);
        this.lock();
    }

    onLeave(client: Client) {
        this.state.playerLeave(client.sessionId);
    }


}
