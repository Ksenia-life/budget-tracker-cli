import { v4 as uuidv4 } from "uuid";
import { IAccount } from "../interfaces/IAccount";
import { ISummary } from "../interfaces/ISummary";
import { Transaction } from "./Transaction";
import { formatCurrency } from "formatCurrency";

export class Account implements IAccount, ISummary {
    readonly id: string;
    name: string;
    transactions: Transaction[];

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.transactions = [];
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
        return `Название ${this.name}: баланс ${formatCurrency(this.balance)}, количество транзакций ${this.transactions.length}`;
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
}
