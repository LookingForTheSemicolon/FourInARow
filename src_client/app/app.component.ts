import { Component } from '@angular/core';
import { LoginComponent } from './login/login-form.component';
import { ChatDialogComponent } from './chat/chat-dialog.component';
import { GameComponent } from './game/game.component';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  template: `
  <div class="container fullspace" fxLayout="column">
    <div class="header">
      <h1>
       {{title}}
      </h1>
    </div>
    <router-outlet class="middle" ></router-outlet>
    <chat-dialog class="bottom" *ngIf="userService?.isLoggedIn" fxFlexAlign="end"></chat-dialog>
  </div>
  `
})
export class AppComponent {
  title = 'Welcome to Four in a Row!';

  constructor(private userService: UserService){

  }
}
