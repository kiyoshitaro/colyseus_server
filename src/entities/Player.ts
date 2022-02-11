import { Schema, type, MapSchema } from "@colyseus/schema";
import { Character } from ".";
export class Player extends Schema {
    @type("string")
    playerName: string;

    @type('number')
    point: number;

    // @type({ map: Character })
    // characters = new MapSchema<Character>();

    constructor() {
        super();
        // this.playerName = playerName;
    }
}