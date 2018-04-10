import { launch as openBrowser, Browser, Page, Response } from 'puppeteer';
import axios from 'axios';

import { TinderAuthInfo } from '../models/tinderAuthInfo';
import { FacebookAuthInfo } from '../models/facebookAuthInfo';

const FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd';
const URL_REGEX = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)\?dpr=[0-9]{1}/;
const GRAPH_ID_URL = 'https://graph.facebook.com/me';

export class AuthService {
    public static GetAuthInfo(facebookAuthInfo: FacebookAuthInfo): Promise<TinderAuthInfo> {
        return AuthService.GetTinderAppAuthToken(facebookAuthInfo.email, facebookAuthInfo.password).then((authToken: string) => {
            return AuthService.GetFacebookUserToken(authToken).then((facebookUserId: string) => 
                <TinderAuthInfo>{
                    id: facebookUserId,
                    token: authToken
                });
        });
    }

    private static GetTinderAppAuthToken(email: string, password: string): Promise<string> {
        return openBrowser().then((browser: Browser) => {
            let page: Page;
            let token: string = '';

            return browser.newPage()
                .then((p: Page) => {
                    page = p;
                    return page.goto(FACEBOOK_AUTHENTICATION_TOKEN_URL);
                })
                .then(() => page.type('input[name=email]', email))
                .then(() => page.type('input[name=pass]', password))
                .then(() => page.click('button[name=login]'))
                .then(() => page.waitForNavigation())
                .then(() => page.evaluate('window.isResponseFound = false'))
                .then(() => {
                    page.on('response', (response: Response) => {
                        if(response.request().url().match(URL_REGEX)) {
                            response.text().then((body: string) => {
                                page.removeAllListeners('response');
                                token = body.match(/access_token=(.+)&/)[1];
                                page.evaluate('window.isResponseFound = true');
                            });
                        }
                    });
                })
                .then(() => page.click('button[name=__CONFIRM__]'))
                .then(() => page.waitForFunction('window.isResponseFound === true')
                .then(() => page.close()))
                .then(() => token);
        });
    }

    private static GetFacebookUserToken(token: string): Promise<string> {
        return axios.get(`${GRAPH_ID_URL}?access_token=${token}`).then(resp => {
            return <string> resp.data.id;
        });
    }
}