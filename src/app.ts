import express from "express";
import bodyParser from "body-parser";
import { Routes } from "./routes/Routes";
class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.setUp();
  }

  private setUp(): void {
    this.app.use(bodyParser.json());
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.routes.for(this.app);
  }
}


export default new App().app;