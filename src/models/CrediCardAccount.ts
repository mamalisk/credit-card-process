import * as transaction from "./Operation";
import CreditCardValidator from "../services/CreditCardValidator";
export default class CreditCardAccount {

    public static defaultLimit: number = 10000;
    public readonly creditCardNumber: string;
    public balance: number;
    private constructor(public readonly name: string,
                        creditCardNumber: string,
                        public readonly limit: number = CreditCardAccount.defaultLimit
                        ) {
                            this.balance = 0;
                            this.creditCardNumber = creditCardNumber;
                        }

    public static with(
                        name: string,
                        creditCardNumber: string,
                        limit: number): CreditCardAccount {
        return new CreditCardAccount(name, creditCardNumber, limit);
    }


}