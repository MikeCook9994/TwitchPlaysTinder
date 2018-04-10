import * as express from 'express';

import { AuthService } from './services/authService';

import { TinderAuthInfo } from './models/tinderAuthInfo';


let server: express.Express = express();

server.get('/auth', (req: express.Request, res: express.Response) => {
    AuthService.GetAuthInfo(req.query.username, req.query.password).then((authInfo: TinderAuthInfo) => {
        res.send(authInfo);
    });
});

server.listen(3011, 'localhost')