import CreditCardAccount from "../models/CrediCardAccount";
import { Validation, Validator, Predicate } from "./validation/ValidationModels";

export default class CreditCardValidator extends Validator<string> {

    /* taking the assumption that credit card number can be only 16 or 19 digits */
    private regexValidation: Validation<string> = (accountNumber) => {
        const regex = new RegExp(/\d{16,19}$/);
        const result = regex.test(accountNumber);
        console.log(`Regex result was: ${result}`);
        return result;
    }

    private checkLuhn: Validation<string> = (accountNumber) => {
        let total: number = 0;
        accountNumber.split("").reverse().forEach((ch, index) => {
            const digit = parseInt(ch);
            total += (index % 2 === 0) ? digit : [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][digit];
        });
        const result = total % 10 === 0;
        console.log(`Luhn result for: ${accountNumber} was ${result}. Total ${total}`);
        return result;
    }

    private predicateOf(statement: Validation<string>): Predicate<string> {
        return {
            value: this.creditCardAccount.creditCardNumber,
            statement,
        };
    }

    public readonly result: boolean;

    constructor(private readonly creditCardAccount: CreditCardAccount) {
        super();
        this.result = this.performAllChecks(
            this.predicateOf(this.regexValidation),
            this.predicateOf(this.checkLuhn),
        );
    }
}