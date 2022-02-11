export type MessageType = 'pick_character' | 'pick_skill' | 'attack' | 'hurt' | 'waiting' | 'start' | 'stop' | 'joined' | 'killed' | 'won' | 'left' | 'timeout';

export interface IMessage {
    type: MessageType;
    timestamp: number;
    from: string;
    params: any;
}
