import { Schema, type, SetSchema } from "@colyseus/schema";
export class Character extends Schema {
    @type('string')
    public id: string;

    @type('number')
    public lives: number = 100;

    //TODO add more properties of character
    constructor(id: string) {
        //TODO init state of each character
        super();
        this.id = id
    }

    hurt(dame: number) {
        this.lives -= dame;
    }
    heal() {
        this.lives += 1;
    }
    isAlive() {
        return this.lives > 0;
    }

}
