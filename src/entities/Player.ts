import { Schema, type, MapSchema } from "@colyseus/schema";
import { Character } from ".";
export class Player extends Schema {
    @type("string")
    playerName: string;

    @type('number')
    public point: number;

    @type([Character])
    public characters: MapSchema<Character> = new MapSchema<Character>();

    constructor(playerName: string) {
        super();
        this.playerName = playerName;
    }
}