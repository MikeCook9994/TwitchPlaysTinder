import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { TinderService } from '../../services/tinder.service';

import { TinderAuthInfo } from '../../models/tinderAuthInfo';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public authInfo: TinderAuthInfo;
    public xAuthToken: string;

    constructor(
        private authService: AuthService,
        private tinderService: TinderService
    ) {}

    ngOnInit() {
        this.authService.GetAuthInfo().subscribe((authInfo: TinderAuthInfo) => {
            this.authInfo = authInfo;
            this.tinderService.Authenticate(this.authInfo).subscribe((authResp: any) => {
                this.xAuthToken = authResp['token'];
            });
        });
    }
}
