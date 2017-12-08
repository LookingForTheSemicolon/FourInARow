import { Component, OnInit } from '@angular/core'
import { UserService } from '../user/user.service';
import { Socket } from 'ng-socket-io';
import { GameService } from './game.service';
import { Board, User } from '../../../src_server/socketServer'

@Component({
  selector: 'game-field',
  styleUrls: ['game.component.css'],
  template:
    `
  <login-form *ngIf=!userService?.isLoggedIn></login-form>
  <ng-container *ngIf="userService?.isLoggedIn">
    <div class="currentPlayer">
      <span>{{gameService?.currentPlayer}}</span>
    </div>
    <div class="board">
      <table>
        <tr *ngFor="let row of field.gameArray; let x = index">
            <td *ngFor="let column of row; let y = index"
              [class.player1]="column == 1"
              [class.player2]="column == 2"
              [class.player]="column == 0"
              (click)="choiceClick(x,y)">{{column}}</td>
        </tr>
      </table>
    </div>
  </ng-container>
  `
})

export class GameComponent implements OnInit {
  field: Board;
  users: User;

  constructor(public userService: UserService, private socket: Socket, public gameService: GameService) {
    this.socket.on('generatedBoard', (data: Board) => {
      this.field = data;
    });
  }

  ngOnInit() {
    this.userService.getUsers.subscribe(users => {
      this.users = users;
    });
  }

  choiceClick(x, y) {
    this.gameService.choice(x, y);
  }
}
