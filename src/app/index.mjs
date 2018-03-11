import puppeteer from 'puppeteer';
import axios from 'axios'

import Debug from 'debug';
const debug = Debug('tinderauth');

const FACEBOOK_AUTHENTICATION_TOKEN_URL = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd';
const URL_REGEX = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)\?dpr=[0-9]{1}/;

export default async function getTokenAndId(email, password) {
    email = email || process.env.FACEBOOK_EMAIL;
    password = password || process.env.FACEBOOK_PASSWORD;

    if (!email || !password) {
        throw new Error('Define username and password via env vars or provide them via function paramaters');
    }

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    try {
        await page.goto(FACEBOOK_AUTHENTICATION_TOKEN_URL);
    } catch (e) {
        throw new Error('Unable to access login page. Ensure you are connected to the internet and contact the developer if this error persists.');
    }

    try {
        await page.type("input[name=email]", email);
        await page.type("input[name=pass]", password);
    } catch (e) {
        let selectorRegex = /input\[name=([a-zA-Z]+)\]/;
        throw new Error(`Unable to locate form field "${e.message.match(selectorRegex)[1]}". Contact the developer if this problem persists.`);
    }

    debug('entered username and password');

    try {
        await page.click("button[name=login]");
    } catch (e) {
        throw new Error('No login button found. If this error persists contact the developer.');
    }

    await page.waitForNavigation();

    if (await page.$('button[name=__CONFIRM__') == null) {
        throw new Error('Login failed. Ensure username and password are correct');
    }

    debug('login succeeded');

    let token = '';

    await page.evaluate('window.isResponseFound = false');

    page.on('response', response => {
        if (response.request().url.match(URL_REGEX)) {
            debug('found matching response to facebook to tinder authorization request');
            response.text().then((body) => {
                page.removeAllListeners('response');
                token = body.match(/access_token=(.+)&/)[1];
                page.evaluate('window.isResponseFound = true');

                debug(`auth token: ${token}`);
            });
        }
    });

    try {
        await page.click('button[name=__CONFIRM__]');
    } catch (e) {
        throw new Error('Unable to click button to authorize tinder. Contact the developer if this issue persists.');
    }

    await page.waitForFunction('window.isResponseFound === true');

    await page.close();
    await browser.close();

    let { data: { id: id } } = await axios.get(`https://graph.facebook.com/me?access_token=${token}`);

    debug(`got profile id: ${id}`);

    return { token, id };
}