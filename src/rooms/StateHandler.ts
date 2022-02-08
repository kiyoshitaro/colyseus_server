import { MapSchema, type, Schema } from "@colyseus/schema";
import { Player } from '../entities/Player';
// Our custom game state, an ArraySchema of type Player only at the moment
export default class StateHandler extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
}

