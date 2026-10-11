import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { TransactionUpdate } from "../interfaces/utility-types";
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

    update(update: TransactionUpdate): void {
        if (update.amount !== undefined) {
            this.amount = update.amount;
        }

        if (update.type !== undefined) {
            this.type = update.type;
        }

        if (update.date !== undefined) {
            this.date = update.date;
        }

        if (update.description !== undefined) {
            this.description = update.description;
        }
    }

    toString(): string {
        const formattedDate = moment(new Date(this.date)).format("LL");

        return `Transaction #${this.id}: ${this.description}, дата: ${formattedDate}, сумма: ${formatCurrency(this.amount)}`;
    }
}
