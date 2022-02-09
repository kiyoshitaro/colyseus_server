export type ActionType = 'attack' | 'boost' | 'pick';

export interface IAction {
    type: ActionType;
    timestamp: number;
    playerId: string;
    value: any;
}
