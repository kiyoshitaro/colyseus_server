import { MapSchema, type, Schema } from "@colyseus/schema";
import { Player, Game, Character } from '../entities';
import { IMessage, IPlayer } from "../types";
import { IAction } from "../types/IAction";
// Our custom game state, an ArraySchema of type Player only at the moment
export default class BattleStateHandler extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type(Game)
    game: Game;

    @type({ map: Character })
    characters = new MapSchema<Character>();

    private actions: IAction[] = [];

    private onMessage: (message: IMessage) => void;
    constructor(
        onMessage: (message: IMessage) => void,
    ) {
        super();

        // Game
        this.game = new Game({});

        // Map
        this.initializeMap();

        // Callback
        this.onMessage = onMessage;
    }

    initializeMap() {
        //TODO Initialize map : character, status, ...
    }

    update() {
        //TODO Write what need to update like character, combat animation here

        this.updateGame();
        this.updatePlayer();
    }

    private updatePlayer() {
        let action: IAction;
        while (this.actions.length > 0) {
            //TODO handle all player action
            action = this.actions.shift();

            switch (action.type) {
                case 'pick':
                    this.playerPick(action.playerId, action.timestamp, action.value);
                    break;
                default:
                    break;
            }
        }
    }

    private updateGame() {
        this.game.update(this.players);
    }

    private playerPick(id: string, timestamp: number, value: any) {
        const player = this.players.get(id);
        if (!player && player.characters.size === 3) {
            this.characters.clear();
            return;
        }
        const characterId = String(value);
        if (this.characters.has(characterId)) {
            player.characters.set(String(value), this.characters.get(characterId));
            this.characters.delete(characterId);
        }
    }


    playerAddAction(action: IAction) {
        this.actions.push(action);
    }

    playerJoin(id: string, playerInfo: IPlayer) {
        //TODO handle when a player join like: set character, set point, ... (can base on game mode)

        const player = new Player(playerInfo.playerName);

        for (let i = 0; i < 10; i++) {
            //TODO need to validate character by access from database ???
            this.characters.set(String(i), new Character());
        }

        this.players.set(id, player);

        this.onMessage({
            type: 'joined',
            from: 'server',
            timestamp: Date.now(),
            params: {
                name: this.players.get(id).playerName,
            },
        });
    }

    playerLeave(id: string) {
        this.onMessage({
            type: 'left',
            from: 'server',
            timestamp: Date.now(),
            params: {
                name: this.players.get(id).playerName,
            },
        });
        this.players.delete(id);
    }
}

