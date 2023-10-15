import { Server, Socket as SocketType } from 'socket.io';
import { Server as HttpServer } from 'http';
import uniqBy from 'lodash/uniqBy';

import User from '../types/user';

class Socket {
  public socketServer: Server;

  public httpServer: HttpServer;

  private users: User[] = [];

  constructor(httpServer: HttpServer) {
    this.httpServer = httpServer;
  }

  public init() {
    this.socketServer = new Server(this.httpServer);
    return this;
  }

  public start() {
    this.socketServer.on('connection', this.connection);
  }

  private connection = (socket: SocketType) => {
    socket.on('join', (data) => {
      this.users = uniqBy([...this.users, data], 'id');
      this.socketServer.emit('join', this.users);
    });

    socket.on('leave', () => {
      this.users = this.users.filter((user) => user.id !== socket.id);
      this.socketServer.emit('leave', this.users);
    });

    socket.on('message', data => {
      this.socketServer.emit('message', data);
    });

    socket.on('disconnect', () => {
      this.users = this.users.filter((user) => user.id !== socket.id);
      this.socketServer.emit('leave', this.users);
      socket.disconnect();
    });
  };
}

export default Socket;
