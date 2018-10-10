import Money from "./Money";

export type OperationType  = "CHARGE" | "CREDIT";

export default class Operation {

    public readonly amount: number;
    constructor(
        public readonly type: OperationType,
        public readonly amountString: string,
        public readonly accountName: string,
        ) {
            this.amount = Money.parse(amountString);
        }
}