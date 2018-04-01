import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { launch as OpenBrowser, Browser, Page } from 'puppeteer';

import { TinderAuthInfo } from '../../models/tinderAuthInfo';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Given the e-mail address and password of a Facebook account, retrieves the Tinder app auth token and the user id
   * of the associated Facebook account for authenticating with Tinder via their API.
   *
   * @param {string} email the e-mail address of the facebook account to get a tinder auth token for
   * @param {string} password the password of the facebook account to get a tinder auth token for
   * @returns {Promise<TinderAuthInfo>} contains the Tinder auth token and the user id of the associated Facebook user
   * account
   * @memberof AuthService
   */
  public GetAuthInfo(email: string, password: string): Promise<TinderAuthInfo> {
    return OpenBrowser()
      .then((browser: Browser) => browser.newPage())
      .then((page: Page) => null);
  }
}
