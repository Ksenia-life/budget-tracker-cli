import { ITransaction, IAccount, ISummary, IAccountManager } from "./types";

export class Transaction implements ITransaction {
    id: number;
    amount: number;
    type: "income" | "expense";
    date: string;
    description: string;

    constructor(id: number, amount: number, type: "income" | "expense", date: string, description: string) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.description = description;
    }

    toString(): string {
        return `Transaction #${this.id}: ${this.description}`;
    }
}

export class Account implements IAccount, ISummary {
    id: number;
    name: string;
    transactions: Transaction[];

    constructor(id: number, name: string) {
        this.id = id;
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
        return `Название ${this.name}: баланс ${this.balance}, количество транзакций ${this.transactions.length}`;
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

    removeTransactionById(transactionId: number): boolean {
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

export class AccountManager implements IAccountManager, ISummary {
    accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    get income(): number {
        return this.accounts.reduce((sum, account) => {
            return sum + account.income;
        }, 0);
    }

    get expenses(): number {
        return this.accounts.reduce((sum, account) => {
            return sum + account.expenses;
        }, 0);
    }

    get balance(): number {
        return this.income - this.expenses;
    }

    addAccount(account: Account): void {
        this.accounts.push(account);
    }

    removeAccountById(accountId: number): boolean {
        const index = this.accounts.findIndex(
            account => account.id === accountId
        );

        if (index !== -1) {
            this.accounts.splice(index, 1);
            return true;
        }
        return false;
    }

    getAccountById(id: number): Account | undefined {
        return this.accounts.find(account => account.id === id);
    }

    getAllAccounts(): Account[] {
        return this.accounts;
    }

    getSummary(): ISummary {
        return {
            income: this.income,
            expenses: this.expenses,
            balance: this.balance
        }
    }

    getSummaryString(): string {
        return `Общий баланс: ${this.balance}, количество счетов: ${this.accounts.length}`;
    }

    toString(): string {
        const accountsString = this.accounts
            .map(account => account.toString())
            .join("\n\n");

        return `Все бюджеты:\n${accountsString}`;
    }

}
