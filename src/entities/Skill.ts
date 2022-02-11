import { Schema, type } from "@colyseus/schema";
export class Skill extends Schema {
    @type('number')
    dame: number;

    @type('string')
    id: string;

    constructor(id: string, dame: number) {
        super();
        this.id = id;
        this.dame = dame;
    }
}
