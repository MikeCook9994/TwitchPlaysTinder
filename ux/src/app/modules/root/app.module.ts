import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AuthService } from '../../services/auth.service';
import { TinderService } from '../../services/tinder.service';


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
    TinderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
