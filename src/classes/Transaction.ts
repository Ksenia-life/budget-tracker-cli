import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { ITransaction } from "../interfaces/ITransaction";
import { TransactionType } from "../interfaces/TransactionType";
import { formatCurrency } from "formatCurrency";

export class Transaction implements ITransaction {
    readonly id: string;
    amount: number;
    type: TransactionType;
    date: string;
    description: string;

    constructor(amount: number, type: TransactionType, date: string, description: string) {
        this.id = uuidv4();
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }

    toString(): string {
        const formattedDate = moment(new Date(this.date)).format("LL");

        return `Transaction #${this.id}: ${this.description}, дата: ${formattedDate}, сумма: ${formatCurrency(this.amount)}`;
    }
}
