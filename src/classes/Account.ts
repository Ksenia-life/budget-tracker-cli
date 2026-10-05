namespace BudgetTracker {
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
}
