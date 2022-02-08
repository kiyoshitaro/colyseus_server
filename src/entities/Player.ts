import { Schema, type } from "@colyseus/schema";

export class Position extends Schema {
    @type("number") x: number = 0.11;
    @type("number") y: number = 2.22;
}

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
    @type("string")
    name: string;

    @type(Position)
    position: Position = new Position();

    @type("boolean")
    connected: boolean = false;
}

