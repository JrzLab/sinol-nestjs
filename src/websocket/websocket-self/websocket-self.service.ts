import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketSelfService {
  constructor() {}
  private clientsCollection: Map<string, Socket> = new Map();

  setClient(clientId: string, socket: Socket) {
    this.clientsCollection.set(clientId, socket);
  }

  deleteClient(clientId: string) {
    this.clientsCollection.delete(clientId);
  }

  getClient(clientId: string) {
    return this.clientsCollection.get(clientId.split('@')[0]);
  }

  getAllClients() {
    return this.clientsCollection;
  }
}
