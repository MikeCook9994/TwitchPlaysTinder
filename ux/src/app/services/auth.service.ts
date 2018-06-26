import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TinderAuthInfo } from '../models/tinderAuthInfo';

@Injectable()
export class AuthService {
    private static readonly BaseUrl = 'http://localhost:3011';
    private static readonly AuthApiPath = '/auth';

    constructor(
        private httpClient: HttpClient
    ) { }

    public GetAuthInfo(): Observable<TinderAuthInfo> {
        return this.httpClient.get<TinderAuthInfo>(`${AuthService.BaseUrl}${AuthService.AuthApiPath}`);
    }
}
