import * as express from 'express';
import * as fs from 'fs';
import * as cors from 'cors';

import AuthService from './services/authService';

import TinderAuthInfo from './models/tinderAuthInfo';
import FacebookAuthInfo from './models/facebookAuthInfo';
import { ECONNRESET } from 'constants';

const APP_PATH = './server/app';

let server: express.Express = express();
let secrets: any = {};

server.use(cors())

server.get('/auth', async (req: express.Request, res: express.Response) => {
    let facebookAuthInfo: FacebookAuthInfo = <FacebookAuthInfo> {
        email: secrets.facebook_username,
        password: secrets.facebook_password
    }
    
    res.send(await AuthService.GetAuthInfo(facebookAuthInfo));
});

server.listen(3011, 'localhost', () => {
    secrets = JSON.parse(fs.readFileSync(`${APP_PATH}/secrets.json`, 'utf8'));
})