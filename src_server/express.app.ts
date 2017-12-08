import * as Express from 'express';

export class ExpressServerApp {
    private expressApp: Express.Express;

    constructor(
        public port: number,
    ) {
        this.expressApp = Express();
        this.initServer();
    }
    
    initServer() {
        // not needed as of now since the client will be served by the angular cli
        // this.expressApp.use(express.static(path.join(__dirname, 'public/dist')));
        // this.expressApp.get('*', function (req, res, next) {
        //     res.sendFile(__dirname + '/public/dist/index.html');
        // });
    }

    getApp() {
        return this.expressApp;
    }

    getStartMessage() {
        return `Server is now running on port ${this.port}`;
    }
}
