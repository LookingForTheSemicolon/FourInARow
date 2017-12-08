import { Injectable, Output, EventEmitter } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Board } from '../../../src_server/socketServer'
import { UserService } from 'app/user/user.service';
import { User } from '../../../src_server/socketServer'
import { Choice } from '../../../src_server/socketServer'

@Injectable()
export class GameService {

  @Output()
  getBoard: EventEmitter<Board> = new EventEmitter<Board>();

  public board: Board;
  public row: number;
  public column: number;
  public player1: string;
  public player2: string;
  public currentPlayer: string;

  constructor(private socket: Socket, private userService: UserService) {
    this.socket.on('players', (data) => {
      this.player1 = data.set.player1;
      this.player2 = data.set.player2
      this.currentPlayer = data.set.currentPlayer;
    });

    this.socket.on('update', (data) => {
      this.currentPlayer = data.set.currentPlayer;
      this.switchPlayer(this.currentPlayer);
      this.getBoard.next(data.set.board);
    });
  }

  switchPlayer(currentPlayer: string) {
    if (this.currentPlayer === this.player1) {
      this.currentPlayer = this.player2;
    } else if (this.currentPlayer === this.player2) {
      this.currentPlayer = this.player1;
    }
  }

  choice(x: number, y: number) {
    if (this.userService.actUser.username === this.currentPlayer) {
      this.socket.emit('choice', {
        set: { currentPlayer: this.currentPlayer, row: x, column: y }
      });
    }
  }

}
