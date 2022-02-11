export type ActionType = 'pick_character' | 'pick_skill' | 'attack';

export interface IAction {
    type: ActionType;
    timestamp: number;
    playerId: string;
    value: any;
}
