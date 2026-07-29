import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SyncService } from './sync.service';
import { IUserAwareness } from '@masar/types';

interface DocumentRoomState {
  users: Map<string, IUserAwareness>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/sync',
})
export class SyncGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private rooms: Map<string, DocumentRoomState> = new Map();

  constructor(private readonly syncService: SyncService) {}

  handleConnection(client: Socket) {
    console.log(`🔌 WebSockets Client Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ WebSockets Client Disconnected: ${client.id}`);
    this.rooms.forEach((roomState, documentId) => {
      if (roomState.users.has(client.id)) {
        roomState.users.delete(client.id);
        const activeUsers = Array.from(roomState.users.values());
        this.server.to(documentId).emit('awareness:update', activeUsers);
      }
    });
  }

  @SubscribeMessage('document:join')
  async handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { documentId: string; user: IUserAwareness },
  ) {
    const { documentId, user } = data;
    client.join(documentId);

    if (!this.rooms.has(documentId)) {
      this.rooms.set(documentId, { users: new Map() });
    }

    const room = this.rooms.get(documentId)!;
    room.users.set(client.id, user);

    const activeUsers = Array.from(room.users.values());
    this.server.to(documentId).emit('awareness:update', activeUsers);

    return { success: true, activeUsers };
  }

  @SubscribeMessage('document:update')
  handleDocumentUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { documentId: string; update: any },
  ) {
    client.to(data.documentId).emit('document:update', data.update);
  }

  @SubscribeMessage('document:save')
  async handleDocumentSave(
    @MessageBody() data: { documentId: string; content: any },
  ) {
    if (data.documentId && data.content) {
      await this.syncService.saveDocumentContent(data.documentId, data.content);
    }
  }
}
