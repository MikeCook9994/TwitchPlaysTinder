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
    this.authService.GetAuthInfo('mcook4728@gmail.com', 'L%q&kgu9Q4iElGjjTNXN4t7gNkZ!773D').subscribe((authInfo: TinderAuthInfo) => {
      this.authInfo = authInfo;
    });
  }
}
