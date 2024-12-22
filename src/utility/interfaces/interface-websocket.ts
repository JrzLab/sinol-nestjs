interface IRoomChat {
  id: number;
  roomId: string;
  createdAt: Date;
  expiredAt: Date;
  messages?: IMessageData[];
}

interface IMessageData {
  uid: string;
  roomId: string;
  senderId: number;
  content: string;
  messageTamp: Date;
}
