import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, FormBuilder} from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login-form.component';
import { UserService } from './user/user.service';
import { ChatDialogComponent } from './chat/chat-dialog.component';
import { GameComponent } from './game/game.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { RouterModule, Routes } from '@angular/router';
import { GameService } from './game/game.service';

const config: SocketIoConfig = { url: 'http://localhost:8988/', options: {} };

const appRoutes: Routes = [
  { path: '', component: GameComponent },
  { path: '**', redirectTo: '',  pathMatch: 'full' }
];

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ChatDialogComponent,
    GameComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],

  providers: [FormBuilder, UserService, GameService],
  bootstrap: [AppComponent],
  exports: [LoginComponent]
})
export class AppModule { }
