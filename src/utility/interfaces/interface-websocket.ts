export interface IMessage {
    messageId: string;
    sender: string;
    content: string;
    type: 'text';
    status: 'sent' | 'delivered' | 'read';
    createdAt: number;
}

export interface IChatRoom {
    roomId: string;
    participants: IParticipant[];
    messages: IMessage[];
    roomCreatedAt: number;
    roomExpiredAt: number;
    lastActivity: number;
}

export interface IParticipant {
    socketId: string;
    userId: string;
    displayName: string;
    role: 'admin' | 'member';
    lastSeen: number;
    isOnline: boolean;
}
