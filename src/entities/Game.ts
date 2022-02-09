import { MapSchema, Schema, type } from '@colyseus/schema';
import { Player } from './Player';

export type GameState = 'waiting' | 'lobby' | 'game';

export interface IGame {
}

export class Game extends Schema {
    @type('string')
    public state: GameState = 'lobby';

    // Init
    constructor(attributes: IGame) {
        super();
        //TODO  define att like game mode, numplayer, handler from room, ...
    }
    // Update
    update(players: MapSchema<Player>) {
        switch (this.state) {
            case 'waiting':
                this.updateWaiting(players);
                break;
            case 'lobby':
                this.updateLobby(players);
                break;
            case 'game':
                this.updateGame(players);
                break;
            default:
                break;
        }
    }

    updateWaiting(players: MapSchema<Player>) {
        if (players.size > 1) {
            this.startLobby();
        }
    }

    updateLobby(players: MapSchema<Player>) {
        // If a player is alone, the game stops.
        if (players.size === 1) {
            this.startWaiting();
            return;
        }
        this.startGame();
    }

    updateGame(players: MapSchema<Player>) {
        //TODO find match time logic and game mode here
    }


    startWaiting() {
        this.state = 'waiting';
        //TODO set time logic (like lobby duration) and call handler state logic (like when win, lose, ...) from room
    }

    startLobby() {
        this.state = 'lobby';
        //TODO set time logic and call handler state from room
    }

    startGame() {
        this.state = 'game';
        //TODO set time logic and call handler state from room
    }
}