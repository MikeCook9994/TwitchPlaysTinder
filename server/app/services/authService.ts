import { Express, Response, Request, Application } from 'express';

export class AuthService {
    public static ConfigureServer(server: Application): void {
        server.get('/auth', (req: Request, res: Response) => {
            res.send({
                'id': 'hello',
                'token': 'world'
            })
        });
    }
}