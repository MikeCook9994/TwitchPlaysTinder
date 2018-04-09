import { launch as openBrowser, Browser, Page } from 'puppeteer';

import { TinderAuthInfo } from '../models/tinderAuthInfo';

export class AuthService {
    public static GetAuthInfo(username: string, password: string): TinderAuthInfo {
        return <TinderAuthInfo>{
            id: 'hello',
            token: 'world'
        };
    }
}