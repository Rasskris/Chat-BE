import 'dotenv/config';
import express from 'express';
import { createServer, Server } from 'http';

import Socket from './services/socket';

class App {
  public app: express.Application;

  public port = process.env.PORT ?? 4000;

  public server: Server;

  public socket: Socket;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socket = new Socket(this.server);

    this.initializeSocketConnection();
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public initializeSocketConnection() {
    this.socket
      .init()
      .start();
  }
}

export default App;