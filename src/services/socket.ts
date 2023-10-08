import { Server, Socket as SocketType } from 'socket.io';
import { Server as HttpServer } from 'http';

class Socket {
  public socketServer: Server;

  public httpServer: HttpServer;

  private sockets: Record<string, unknown>;

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

  private connection(socket: SocketType) {
    const { userId } = socket.handshake.auth;

    this.sockets[userId] = socket;
  
    socket.on('join', (gameId) =>  {
      this.join(socket, gameId);
    });
  
    socket.on('disconnect', () => {
      delete this.sockets[userId];
    });
  }

  private join(socket: SocketType, gameId: string){
    socket.join(gameId);
  }
  
  private leave(socket: SocketType, gameId: string) {
    socket.leave(gameId);
  }
}

export default Socket;
