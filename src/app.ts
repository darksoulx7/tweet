import express, { Express } from 'express';
import  { ChattyServer }  from '../src/setupServer';
import mongoConnect from './db';

class Application {
    public initialize(): void {
        mongoConnect();
        const app: Express = express()
        const server: ChattyServer = new ChattyServer(app)
        server.start()
    }
}

const application: Application = new Application();
application.initialize();