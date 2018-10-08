import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import { Routes } from "./routes/eventsRoutes";

const MONGO_URL = process.env.MONGO_URL || 'mongodb://testUser:testUser1@ds115543.mlab.com:15543/peccadb';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public mongoUrl: string = MONGO_URL;

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
    this.mongoSetup();
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;