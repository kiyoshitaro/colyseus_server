export type MessageType = 'waiting' | 'start' | 'stop' | 'joined' | 'killed' | 'won' | 'left' | 'timeout';

export interface IMessage {
    type: MessageType;
    timestamp: number;
    from: string;
    params: any;
}
