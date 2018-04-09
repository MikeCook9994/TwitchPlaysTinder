import * as express from 'express';

import { AuthService } from './services/authService';

let server: express.Express = express();

AuthService.ConfigureServer(server);

server.listen(3011, 'localhost')