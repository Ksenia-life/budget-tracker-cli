namespace BudgetTracker {
    export class Transaction implements ITransaction {
        id: number;
        amount: number;
        type: TransactionType;
        date: string;
        description: string;

        constructor(id: number, amount: number, type: TransactionType, date: string, description: string) {
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
}
