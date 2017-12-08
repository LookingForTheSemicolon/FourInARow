import { Injectable, Output, EventEmitter } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Board } from '../../../src_server/socketServer'
import { UserService } from 'app/user/user.service';
import { User } from '../../../src_server/socketServer'
import { Choice } from '../../../src_server/socketServer'


interface Bla {
    name: string;
    color: string;
}

@Injectable()
export class GameService {

  public board: Board;
  public row;
  public column;
  public player1: User;
  public player2: User;
  public currentPlayer: User;

  constructor(private socket: Socket, private userService: UserService) {
    this.socket.on('players', (data) => {
      this.player1 = data.set.player1;
      this.player2 = data.set.player2
      this.currentPlayer = this.player1;
    });

    this.socket.on('updatedBoard', (data: Board) => {
      this.board.gameArray = data.gameArray;
    });

    this.socket.on('playersChoice', (data: Choice) => {
        if (this.userService.actUser.username === this.player1.username) {
          this.board.gameArray[data.set.row][data.set.column] = 1;
        } else {
          this.board.gameArray[data.set.row][data.set.column] = 2;
        }
      this.currentPlayer.username = data.set.currentPlayer;
      this.socket.emit('board', this.board);
      this.switchPlayer(this.currentPlayer);

    });
  }

  switchPlayer(currentPlayer) {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else if (this.currentPlayer === this.player2) {
      this.currentPlayer = this.player1;
    }
  }

  choice(x, y) {
    if (this.userService.actUser.username === this.currentPlayer.username) {
      this.socket.emit('choice', {
        set: { username: this.currentPlayer.username, row: x, column: y }
      });
    }
  }

}
