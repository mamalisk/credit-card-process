import * as loki from "lokijs";
import CreditCardAccount from "../models/CrediCardAccount";
import CreditCardValidator from "./CreditCardValidator";
import Money from "../models/Money";
import Operation from "../models/Operation";

/**
 * Service for Account opening and retrieval
 */
export default class AccountsService {

    public constructor(private readonly accounts: Collection<CreditCardAccount>) {}

    /**
     * Validates the account (easy access to <CreditCardValidator>)
     * @param accountNumber number of credit card
     * @param name account name
     * @param limit limit of the credit card
     */
    public validate(
        accountNumber: string,
        name: string,
        limit?: number,
    ): boolean {
        return new CreditCardValidator(CreditCardAccount.with(name, accountNumber, limit)).result;
    }
    /**
     * Opens an account after ensuring that there is no account
     * with the same name and number
     * @param accountNumber the number of the credit card
     * @param name the name of the account
     * @param limit the credit card limit (optional)
     */
    public open(
            accountNumber: string,
            name: string,
            limit?: number,
        ): void {
            const account = CreditCardAccount.with(name, accountNumber, limit);

            if (this.accountDoesAgainstEither(name, accountNumber)) {
                this.accounts.insert(account);
                console.log("account was added successfully");
                console.log(this.accounts.find({ name: account.name }));
            }
            else throw new Error(`Account was already present against name: ${name}`);
    }

    /**
     * Returns an array of all the accounts in the system (unsorted)
     */
    public all() {
        return this.accounts.find().map(a => {
           const account =  CreditCardAccount.with(a.name, a.creditCardNumber, a.limit);
           return {
               ...account,
               balance: Money.format(a.balance)
           };
        });
    }

    public process(operation: Operation): any {
        const account = this.accounts.findOne({ name: operation.accountName });
        if (!account) return account;
        const { name, creditCardNumber, limit, balance } = account;
        switch (operation.type) {
            case "CREDIT": {
                const newBalance = balance - operation.amount;
                const updated = {
                    name,
                    creditCardNumber,
                    limit,
                    balance: newBalance
                };
                this.accounts.remove(account);
                this.accounts.insert(updated);
                return {
                    accountNumber: updated.creditCardNumber,
                    balance: Money.format(updated.balance),
                };
            }
            case "CHARGE": {
                const newBalance = balance + operation.amount;
                const updated = {
                    name,
                    creditCardNumber,
                    limit,
                    balance: newBalance
                };
                this.accounts.remove(account);
                this.accounts.insert(updated);
                return {
                    accountNumber: updated.creditCardNumber,
                    balance: Money.format(updated.balance),
                };
            } default: throw new Error("unknown operation");
        }
    }

    /**
     * Ensures that no account exists with either the same credit card number
     * or the same account name
     * @param name The name of the account
     * @param creditCardNumber the number of the credit card
     */
    private accountDoesAgainstEither(name: string, creditCardNumber: string): boolean {
        return !this.accounts.findOne({ name }) || !this.accounts.findOne({ creditCardNumber });
    }
}