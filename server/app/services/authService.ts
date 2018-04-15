import axios from 'axios';
import { launch as openBrowser, Browser, Page, Response } from 'puppeteer';

import TinderAuthInfo  from '../models/tinderAuthInfo';
import FacebookAuthInfo from '../models/facebookAuthInfo';

export default class AuthService {

    /**
     * The url where facebook is logged into to get Tinder's app token
     * 
     * @private
     * @type {string}
     * @memberof AuthService
     */
    private static readonly FACEBOOK_AUTHENTICATION_TOKEN_URL: string = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd';
    
    /**
     * This regular expression matches the section of the body of the response that contains the auth token
     * 
     * @private
     * @type {RegExp}
     * @memberof AuthService
     */
    private static readonly URL_REGEX: RegExp = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)\?dpr=[0-9]{1}/;

    /**
     * The base url for facebook's graph Api to get the users facebook id.
     * 
     * @private
     * @type {string}
     * @memberof AuthService
     */
    private static readonly GRAPH_ID_URL: string = 'https://graph.facebook.com/me';

    /**
     * Retrieves the Tinder's Facebook app token and the user id for the user account associated 
     * with the provided login information.
     * 
     * @static
     * @param {FacebookAuthInfo} facebookAuthInfo 
     * @returns {Promise<TinderAuthInfo>} 
     * @memberof AuthService
     */
    public static async GetAuthInfo(facebookAuthInfo: FacebookAuthInfo): Promise<TinderAuthInfo> {
        let authToken: string = await AuthService.GetTinderAppAuthToken(facebookAuthInfo.email, facebookAuthInfo.password)
        let facebookUserId: string = await AuthService.GetFacebookUserToken(authToken);

        return <TinderAuthInfo>{
                id: facebookUserId,
                token: authToken
        };
    }

    private static async GetTinderAppAuthToken(email: string, password: string): Promise<string> {

        let browser: Browser = await openBrowser();
        let page: Page = await browser.newPage();

        await page.goto(this.FACEBOOK_AUTHENTICATION_TOKEN_URL);
        await page.type('input[name=email]', email);
        await page.type('input[name=pass]', password);
        await page.click('button[name=login]');
        await page.waitForNavigation();
        await page.evaluate('window.isResponseFound = false');
      
        let token: string;

        page.on('response', (response: Response) => {
            if(response.request().url().match(this.URL_REGEX)) {
                response.text().then((body: string) => {
                    page.removeAllListeners('response');
                    token = body.match(/access_token=(.+)&/)[1];
                    page.evaluate('window.isResponseFound = true');
                });
            }
        });

        await page.click('button[name=__CONFIRM__]');
        await page.waitForFunction('window.isResponseFound === true');
        await page.close();
        await browser.close();

        return token;
    }

    private static GetFacebookUserToken(token: string): Promise<string> {
        return axios.get(`${this.GRAPH_ID_URL}?access_token=${token}`).then(resp => {
            return <string> resp.data.id;
        });
    }
}