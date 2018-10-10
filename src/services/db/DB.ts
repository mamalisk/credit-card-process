import loki from "lokijs";
import CreditCardAccount from "../../models/CrediCardAccount";

export class InMemoryDB {

    public accounts: Collection<CreditCardAccount>;
    constructor(private readonly connection: loki = new loki("database.json")) {
        this.accounts = this.connection.addCollection("accounts");
        console.log("DB was setup");
        console.log(this.accounts);
    }
}

export default new InMemoryDB();