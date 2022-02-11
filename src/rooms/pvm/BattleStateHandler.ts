import { MapSchema, type, Schema } from "@colyseus/schema";
import { Player, Game, Character, Skill, Monster } from '../../entities';
import { IMessage, IPlayer } from "../../types";
import { IAction } from "../../types/IAction";
import { getRandomKeyInMap, getRandomItemInMap, getRandomIntInclusive } from "../../helpers/random";
export default class BattleStateHandler extends Schema {

    @type(Game)
    game: Game;

    @type(Player)
    player: Player;

    @type("boolean")
    isPlayerTurn: boolean;

    @type({ map: Character })
    characters: MapSchema<Character> = new MapSchema<Character>();

    @type(Character)
    pickedChar: Character;

    @type({ map: Skill })
    skills: MapSchema<Skill> = new MapSchema<Skill>();

    @type(Skill)
    pickedSkill: Skill;

    @type({ map: Monster })
    monsters: MapSchema<Monster> = new MapSchema<Monster>();

    @type(Monster)
    pickedMonster: Monster;

    private actions: IAction[] = [];

    private broadcastMessage: (message: IMessage) => void;
    constructor(
        broadcastMessage: (message: IMessage) => void,
    ) {
        super();

        // Game
        this.game = new Game({});

        // Map
        this.initializeMap();

        // Callback
        this.broadcastMessage = broadcastMessage;
    }

    initializeMap() {
        //TODO Initialize map : character, status, ...

        this.isPlayerTurn = true;
        for (let i = 0; i < 3; i++) {
            this.monsters.set(String(i), new Monster(String(i)));
        }
    }
    playerPickCharacter(action: IAction) {
        this.characters.forEach((value, key) => {
            if (value.id === String(action.value)) {
                this.pickedChar = value;
            }
        });
        if (!this.pickedChar) {
            return;
        }

        this.skills.set("1", new Skill("1", 10));
        this.skills.set("2", new Skill("2", 15));

        this.broadcastMessage({
            type: 'pick_character',
            from: 'server',
            timestamp: Date.now(),
            params: {
                characterId: action.value,
            },
        });
    }

    playerPickSkill(action: IAction) {
        this.skills.forEach((value, key) => {
            if (value.id === String(action.value)) {
                this.pickedSkill = value;
            }
        });
        this.broadcastMessage({
            type: 'pick_skill',
            from: 'server',
            timestamp: Date.now(),
            params: {
                skillId: action.value,
                dame: this.pickedSkill.dame,
            },
        });
    }

    playerAttack(action: IAction) {
        if (this.isPlayerTurn) {
            const pickedMonsterKey = getRandomKeyInMap(this.monsters);
            this.pickedMonster = this.monsters.get(pickedMonsterKey);
            this.pickedMonster.hurt(this.pickedSkill.dame);
            if (this.pickedMonster.isAlive) {
                this.monsters.set(pickedMonsterKey, this.pickedMonster);
            }
            else {
                this.monsters.delete(pickedMonsterKey);
            }
            this.isPlayerTurn = false;
            setTimeout(() => { this.monsterAttack() }, 2000);

            this.broadcastMessage({
                type: 'attack',
                from: 'server',
                timestamp: Date.now(),
                params: {
                    monsterId: pickedMonsterKey,
                    lives: this.pickedMonster.lives,
                },
            });
        }
    }

    monsterAttack() {
        const pickedCharacter = getRandomItemInMap(this.characters);
        pickedCharacter.hurt(getRandomIntInclusive(1, 20));
        this.characters.set(pickedCharacter.id, pickedCharacter);
        this.isPlayerTurn = true;
        this.broadcastMessage({
            type: 'hurt',
            from: 'server',
            timestamp: Date.now(),
            params: {
                characterId: pickedCharacter.id,
                lives: pickedCharacter.lives,
            },
        });

    }

    playerJoin(id: string) {
        //TODO handle when a player join like: set character, set point, ... (can base on game mode)
        const player = new Player();
        // this.players.set(id, player);
        for (let i = 0; i < 3; i++) {
            //TODO need to validate character by access from database ???
            this.characters.set(String(i), new Character(String(i)));
        }

        this.broadcastMessage({
            type: 'joined',
            from: 'server',
            timestamp: Date.now(),
            params: {},
        });
    }

    playerLeave(id: string) {
        this.broadcastMessage({
            type: 'left',
            from: 'server',
            timestamp: Date.now(),
            params: {},
        });
    }

    // update() {
    //     //TODO Write what need to update like character, combat animation here

    //     this.updateGame();
    //     this.updatePlayer();
    // }

    // private updatePlayer() {
    //     let action: IAction;
    //     while (this.actions.length > 0) {
    //         //TODO handle all player action
    //         action = this.actions.shift();

    //         switch (action.type) {
    //             case 'pick_character':
    //             case 'pick_skill':
    //                 // this.playerPick(action.playerId, action.timestamp, action.value);
    //                 break;
    //             case 'attack':

    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

    // private updateGame() {
    //     this.game.update(this.players);
    // }

    // private playerPick(id: string, timestamp: number, value: any) {
    //     const player = this.players.get(id);
    //     if (!player && player.characters.size === 3) {
    //         this.characters.clear();
    //         return;
    //     }
    //     const characterId = String(value);
    //     if (this.characters.has(characterId)) {
    //         player.characters.set(String(value), this.characters.get(characterId));
    //         this.characters.delete(characterId);
    //     }
    // }

}

