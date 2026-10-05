namespace BudgetTracker {
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
}
