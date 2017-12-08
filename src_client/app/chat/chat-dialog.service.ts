import { Injectable, Attribute} from '@angular/core';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';

@Injectable()
export class ChatService {
    private date: string = this.socket.ioSocket.json.id;
    private user: string;

    constructor(private socket: Socket) { }

    getMessage() {
        return this.socket
            .fromEvent<any>('msg')
            .map(data => data.msg);
    }

    sendMessage(msg: string) {
        this.socket.emit('msg', {
          sendFrom: {
            user: this.user,
            date: this.date =  new Date().toLocaleTimeString(),
            msg: msg
          }
        });
    }
}
