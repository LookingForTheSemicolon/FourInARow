import { Injectable, EventEmitter, Output } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { loadavg } from 'os';
import { User } from '../../../src_server/socketServer'

@Injectable()
export class UserService {

  @Output()
  getUsers: EventEmitter<User[]> = new EventEmitter<User[]>();

  public actUser: User;
  public loggedIn: boolean = true;

  get isLoggedIn() {
    return this.actUser !== undefined;
  }

  private _users: User[] = [];

  constructor(private socket: Socket) {
    this.socket.on('users', data => {
      this._users = data.users;
      this.getUsers.next(this._users);
    })
  }

  // 2. sends user information to server
  loginUser(username: string) {
    // check if user is legit
    this.actUser = {
      id: this.socket.ioSocket.json.id,
      username: username,
      loginStatus: true,
      win: 0,
      lose: 0
    };

    this.socket.emit('login', this.actUser);
  }

}
