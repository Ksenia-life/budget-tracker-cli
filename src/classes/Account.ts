import { v4 as uuidv4 } from "uuid";
import { IAccount } from "../interfaces/IAccount";
import { ISummary } from "../interfaces/ISummary";
import { Transaction } from "./Transaction";
import { writeFile } from "node:fs/promises";
import { escapeCsvValue } from "../utils/escapeCsvValue";
import { formatCurrency } from "formatCurrency";
import { AccountUpdate } from "../interfaces/utility-types";
import { ReadOnly } from "../decorators/ReadOnly";
import { Metadata } from "../decorators/Metadata";

export class Account implements IAccount, ISummary {
    @ReadOnly
    id: string;
    name: string;
    @Metadata("description", "Массив транзакций счета")
    transactions: Transaction[];

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.transactions = [];
    }

    update(update: AccountUpdate): void {
        if (update.name !== undefined) {
            this.name = update.name;
        }
    }

    get income(): number {
        return this.transactions.reduce((sum, transaction) => {
            if (transaction.type === "income") {
                return sum + transaction.amount;
            }

            return sum;
        }, 0);
    }

    get expenses(): number {
        return this.transactions.reduce((sum, transaction) => {
            if (transaction.type === "expense") {
                return sum + transaction.amount;
            }
            return sum;
        }, 0);
    }

    get balance(): number {
        return this.income - this.expenses;
    }

    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

    getSummary(): ISummary {
        return {
            income: this.income,
            expenses: this.expenses,
            balance: this.balance
        }

    }

    getSummaryString(): string {
        const description = Reflect.getMetadata("description", this, "transactions");

        return `Название ${this.name}: баланс ${formatCurrency(this.balance)}, количество транзакций ${this.transactions.length}, ${description}`;
    }

    toString(): string {
        const transactionsString = this.transactions
            .map(transaction => transaction.toString())
            .join("\n");

        return `Счёт #${this.id}: ${this.name}\n${transactionsString}`;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    removeTransactionById(transactionId: string): boolean {
        const index = this.transactions.findIndex(
            transaction => transaction.id === transactionId
        );

        if (index !== -1) {
            this.transactions.splice(index, 1);
            return true;
        }
        return false;
    }
    async exportTransactionsToCSV(filename: string): Promise<void> {
        const header = "id,amount,type,date,description";

        const rows = this.transactions.map(transaction => {
            const values = [
                transaction.id,
                transaction.amount,
                transaction.type,
                transaction.date,
                transaction.description
            ];

            return values.map(escapeCsvValue).join(",");
        });

        const csvContent = [header, ...rows].join("\n");
        try {
            await writeFile(filename, csvContent, "utf8");
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Не удалось записать CSV-файл "${filename}": ${error.message}`);
            }

            throw new Error(`Не удалось записать CSV-файл "${filename}".`);
        }

    }
}
