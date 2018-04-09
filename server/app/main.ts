import * as express from 'express';

import { AuthService } from './services/authService';

let server: express.Express = express();

server.get('/auth', (req: express.Request, res: express.Response) => {
    res.send(AuthService.GetAuthInfo(req.query.username, req.query.password));
});

server.listen(3011, 'localhost')