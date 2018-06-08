import * as express from 'express';
import * as fs from 'fs';

import AuthService from './services/authService';

import TinderAuthInfo from './models/tinderAuthInfo';
import FacebookAuthInfo from './models/facebookAuthInfo';

const APP_PATH = './server/app';

let server: express.Express = express();
let secrets: any = {};

server.get('/auth', async (req: express.Request, res: express.Response) => {
    let facebookAuthInfo: FacebookAuthInfo = <FacebookAuthInfo> {
        email: secrets.facebook_username,
        password: secrets.facebook_password
    }

    let authInfo: TinderAuthInfo = await AuthService.GetAuthInfo(facebookAuthInfo);

    res.send(authInfo);
});

server.listen(3011, 'localhost', () => {
    secrets = JSON.parse(fs.readFileSync(`${APP_PATH}/secrets.json`, 'utf8'));
})