import { Component, Input} from '@angular/core';
import { ChatService } from './chat-dialog.service';
import { UserService } from '../user/user.service';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'chat-dialog',
  styleUrls: ['chat-dialog.component.css'],
  template: `
  <div class="container">
      <div class="container-item-dialog">
        <div #scroll [scrollTop]="scroll.scrollHeight" class="item-textarea"  [innerHTML]="msg">
        </div>
        <div class="item-userList">
          <p *ngFor="let user of users">{{user.username}}</p>
        </div>
      </div>
      <div class="container-item-input">
        <input type="text" #msgInput (keyup.enter)="sendMsg(msgInput.value)"
        >
        <button class="btn btn-small" type="button"
          (click)="sendMsg(msgInput.value)">
          send message
        </button>
      </div>
  </div>
  `,
providers : [ChatService],
})

export class ChatDialogComponent{

  msg: string = '';
  users;
  status;
  constructor(private chatService: ChatService, private userService: UserService, private socket: Socket) { }

  ngOnInit() {
    // observable for messages
    this.chatService
        .getMessage()
        .subscribe(msg => {
          this.msg += this.escapeHtml(msg) + '<br>';
        });
    // observable for userlist
    this.userService
        .getUsers
        .subscribe(users => {
        this.users = users;
    });
  }
  // method to send messages from type string
  sendMsg(msg: string){
    this.chatService.sendMessage(msg);
  }

  escapeHtml(unsafe: string) {
    return unsafe
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/'/g, '&quot;')
         .replace(/'/g, '&#039;');
  }
}
