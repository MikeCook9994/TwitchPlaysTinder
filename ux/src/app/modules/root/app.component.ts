import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { TinderAuthInfo } from '../../models/tinderAuthInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public authInfo: TinderAuthInfo;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() { 
    this.authService.GetAuthInfo('', '')
    .then((authInfo: TinderAuthInfo) => this.authInfo = authInfo);
  }
}
