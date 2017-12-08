import { Component, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { UserService } from '../user/user.service'
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'login-form',
  template: `
      <div class="container" *ngIf="!userService?.isLoggedIn">
        <div>
          <input class="item form-control username" type="text" id="username" ngModel name="username"
           #username="ngModel" placeholder="{{placeholder}}" required>
          <div *ngIf="username.touched && username.errors">
            <div class="alert alert-danger" *ngIf="username.errors.required">
              Username ist required
            </div>
          </div>
        </div>
        <button class="item btn btn-primary" type="button" (click)="login(username.value)"
          [routerLink]="['Home']" [disabled]="!username.valid">Login</button>
      </div>
  `,
  styleUrls: ['login-form.css']
})

export class LoginComponent {
  public username: string;
  private placeholder: string = 'Please choose a Username';

  constructor(public userService: UserService, private socket: Socket) { }

  // 1. sends username and boolean status to the User Service
  login(username: string) {
    this.userService.loginUser(username);
  }
}
