import { Schema, type } from "@colyseus/schema";

export class Character extends Schema {
    @type('number')
    public lives: number = 100;

    //TODO add more properties of character

    constructor() {
        super();
        //TODO init state of each character
    }
}
