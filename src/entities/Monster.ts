import { Schema, type } from "@colyseus/schema";
export class Monster extends Schema {

    @type('string')
    public id: string;

    @type('number')
    public lives: number = 100;

    constructor(id: string) {
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
