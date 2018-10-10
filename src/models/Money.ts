export default class Money {
    static format(amount: number): string {
        return `£${Math.abs(amount).toFixed(2)}`;
    }

    static parse(s: string): number {
        const validate = new RegExp(/^\£([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.\d{2})$/).test(s);
        if (!validate) {
            throw new Error(`Wrongly formatted amount: ${s}`);
        }
        return Number(s.replace("£", "").replace(",", ""));
    }
}