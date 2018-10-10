import express from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes/Routes";
export class App {
  public app: express.Application;
    constructor(public readonly routes: Routes = new Routes()) {
    this.app = express();
    this.conf();
  }

  private conf(): void {
    this.app.use(bodyParser.json());
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.routes.for(this.app);
  }
}


export default new App().app;