import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AuthService } from '../../services/auth.service';
import { TinderClientService } from '../../services/tinderClient.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    TinderClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
