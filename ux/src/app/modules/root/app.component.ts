import { Component, OnInit } from '@angular/core';
import { flatMap, tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { TinderClientService } from '../../services/tinderClient.service';

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
        private tinderService: TinderClientService
    ) {}

    ngOnInit() {
        this.authService.GetAuthInfo()
            .pipe(
                tap((authInfo: TinderAuthInfo) => this.authInfo = authInfo),
                flatMap((authInfo: TinderAuthInfo) => this.tinderService.Authenticate(this.authInfo)))            
            .subscribe((authResp: any) => this.xAuthToken = authResp['token'])
    }
}
