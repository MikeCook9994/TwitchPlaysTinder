import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TinderAuthInfo } from '../models/tinderAuthInfo';

@Injectable()
export class TinderClientService {
    private static readonly TinderBaseUrl: string = 'https://api.gotinder.com/api';
    private static readonly TinderAuthApiPath: string = '/auth';

    private static readonly DefaultHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'User-Agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
            'Access-Control-Allow-Origin': '*'
        });

    constructor(
        private httpClient: HttpClient
    ) { }

    public Authenticate(authInfo: TinderAuthInfo): Observable<any> {
        const url: string = `${TinderClientService.TinderBaseUrl}${TinderClientService.TinderAuthApiPath}`;
        return this.httpClient.post(url, authInfo, {
            headers: TinderClientService.DefaultHeaders
        });
    }
}