import * as express from 'express';
import * as fs from 'fs';

import AuthService from './services/authService';

import TinderAuthInfo from './models/tinderAuthInfo';
import FacebookAuthInfo from './models/facebookAuthInfo';

let server: express.Express = express();

server.get('/auth', (req: express.Request, res: express.Response) => {
    let secrets: any = JSON.parse(fs.readFileSync('./server/app/secrets.json', 'utf8'));

    let facebookAuthInfo: FacebookAuthInfo = <FacebookAuthInfo> {
        email: secrets.facebook_username,
        password: secrets.facebook_password
    }

    AuthService.GetAuthInfo(facebookAuthInfo).then((authInfo: TinderAuthInfo) => {
        res.send(authInfo);
    });
});

server.listen(3011, 'localhost')