import { Request, Response, Application } from "express";
import { Services, default as _ } from "../services/";
import { OperationType } from "../models/Operation";
import Operation from "../models/Operation";
export class Routes {
    public for(app: Application, services: Services = _): void {

        /* Get all cards */
        app.route("/card")
            .get((req: Request, res: Response) => {
                res.status(200).send(services.accounts.all());
            })
        /* Add a card */
            .post((req: Request, res: Response) => {
                const { accountNumber, name, balance } = req.body;
               if (!accountNumber || !services.accounts.validate(accountNumber, name, balance)) {
                   res.status(400).send({
                       message: "Credit Card number was invalid",
                   });
                   return;
               }

               try { services.accounts.open(
                    accountNumber,
                    name,
                    balance
                );
                res.status(201).send({ message: "Account opening was successful!"});
               } catch (error) {
                   const statusCode: number = (error.message === `Account was already present against name: ${name}`) ? 409 : 500;

                   res.status(statusCode).send({
                       message: error.message,
                   });
               }
            })
        /* Charge or Credit a card */
            .put((req: Request, res: Response) => {
                const operation = new Operation(req.body.type, req.body.amount, req.body.accountName);
                res.status(200).send(services.accounts.process(operation));
            });
    }
}


