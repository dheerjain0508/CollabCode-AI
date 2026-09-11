import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(client: Socket, projectId: string) {
    client.join(`project:${projectId}`);

    return {
      event: 'joined',
      projectId,
    };
  }

  notifyProjectUpdate(projectId: string, data: unknown) {
    this.server
      .to(`project:${projectId}`)
      .emit('projectUpdated', data);
  }
}