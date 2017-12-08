import * as Http from 'http';
import * as Path from 'path';
import * as SocketIO from 'socket.io';
import { userInfo } from 'os';
import { Event } from '_debugger';

export interface Message {
  sendFrom: {
    msg: string,
    date: string,
    user: string
  }
}

export interface Choice {
  set: {
    currentPlayer: string,
    row: number,
    column: number
  }
}

export interface Board {
  width: number,
  height: number,
  gameArray: number[][],
}

export interface User {
  id: string,
  username: string,
  loginStatus: boolean,
  win: number,
  lose: number
}

export class SocketServer {
  connectedSockets: SocketIO.Socket[] = [];
  users = new Map<string, User>();
  msg: Array<any> = [];
  board: Board;

  private socketServer: SocketIO.Server;

  constructor(server: Http.Server) {
    this.socketServer = SocketIO(server);
    this.initConnection();
    this.createBoard(6, 8);
  }

  // subscribe to socket events
  private initConnection() {
    this.socketServer.sockets.on('connection', socket => {
      this.StartGame();
      this.initLogging(socket);
      socket.on('login', data => this.onLogin(data));
      socket.on('msg', msg => this.onMessage(msg));
      socket.on('board', data => this.onBoard(data));
      socket.on('choice', data => this.onChoice(data));
    });
  }

  //  Server Logging about connection or disconnection of single sockets
  private initLogging(socket: SocketIO.Socket) {
    this.connectedSockets.push(socket);
    console.log('User connected: %s socket/s connected', this.connectedSockets.length);
    socket.on('disconnect', () => this.onDisconnect(socket));
  }

  // creates user object with additional information about the socket-id
  private onLogin(data: User) {
    this.users.set(data.id, data);
    this.emitUsers();
    if (this.users.size === 2) {
      const _users = Array.from(this.users.values());
      const playerIdx = Math.floor(Math.random() * 2);
      const player1 = _users.splice(playerIdx, 1)[0];
      const player2 = _users.pop();
      this.socketServer.sockets.emit('players', {
        set: {
          player1: player1.username,
          player2: player2.username,
          currentPlayer: player1.username
        }
      });
    }
  }

  private createBoard(xSize: number, ySize: number) {
    const newBoard = [];
    for (let i = 0; i < xSize; i++) {
      newBoard[i] = [0];
      for (let j = 0; j < ySize; j++) {
        newBoard[i][j] = 0;
      }
    }
    this.board = {
      width: xSize,
      height: ySize,
      gameArray: newBoard,
    }
    return this.board
  }

  private StartGame() {
    this.socketServer.sockets.emit('generatedBoard', this.board);
  }
  private onMessage(message: Message) {
    const msg = `[${message.sendFrom.date}] ${this.getUserName(message.sendFrom.user)}: ${message.sendFrom.msg}`;
    this.socketServer.sockets.emit('msg', { msg: msg });
  }

  private onBoard(data: Board) {
    this.socketServer.sockets.emit('updatedBoard', data);
  }

  private onChoice(data: Choice) {
    this.socketServer.sockets.emit('playersChoice', {
      set: {
        currentPlayer: data.set.currentPlayer,
        row: data.set.row,
        column: data.set.column
      }
    });
  }

  private emitUsers() {
    this.socketServer.sockets.emit('users', { users: Array.from(this.users.values()) });
  }

  private emitCurrentPlayer(username: string) {
    this.socketServer.sockets.emit('currentPlayer', username);
  }

  private getUserName(id: string) {
    return this.users.get(id).username;
  }

  private onDisconnect(socket: SocketIO.Socket) {
    this.connectedSockets.splice(this.connectedSockets.indexOf(socket), 1);
    // remove user when refresh oder logout
    this.users.delete(socket.id);
    this.emitUsers();
    console.log('User disconnected: %s socket/s still connected', this.connectedSockets.length);
  }

}
