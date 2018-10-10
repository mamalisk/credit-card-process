import AccountsService from "./Accounts";
import db from "./db/DB";

export interface Services {
    accounts: any;
    operations?: any | null;
}

const services: Services = {
    accounts: new AccountsService(db.accounts),
};

export default services;
