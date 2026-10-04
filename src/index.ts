import {
    IAccountManager,
    IAccount,
    ITransaction,
    ISummary
} from "./types";

const accountManager: IAccountManager & { accounts: IAccount[] } = {
    accounts: [],

    addAccount(account: IAccount): void {
        this.accounts.push(account);
    },

    removeAccountById(accountId: number): boolean {
        const index = this.accounts.findIndex(
            (account) => account.id === accountId
        );

        if (index === -1) {
            return false;
        }

        this.accounts.splice(index, 1);
        return true;
    },

    getAccounts(): IAccount[] {
        return this.accounts;
    },

    getAccountById(id: number): IAccount | undefined {
        const index = this.accounts.findIndex(
            (account) => account.id === id
        );
        return this.accounts[index];
    },

    getSummary(accountId: number): ISummary {
        const account = this.getAccountById(accountId);

        if (!account) {
            throw new Error("Счёт не найден");
        }

        const transactions = account.getTransactions();

        const income = transactions.reduce((sum, transaction) => {
            if (transaction.type === "income") {
            return sum + transaction.amount;
        }

        return sum;
        }, 0);

        const expenses = transactions.reduce((sum, transaction) => {
            if (transaction.type === "expense") {
                return sum + transaction.amount;
            }
            return sum;
        }, 0);

        const balance = income - expenses;

        return { 
            income, 
            expenses,
            balance
        };
    }
};

const account: IAccount & { transactions: ITransaction[] } = {
  id: 1,
  name: "Личный бюджет",
  transactions: [],

  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  },
  removeTransactionById(transactionId: number): boolean {
    const index = this.transactions.findIndex(
            (transaction) => transaction.id === transactionId
        );

        if (index === -1) {
            return false;
        }

        this.transactions.splice(index, 1);
        return true;
  },
  getTransactions(): ITransaction[] {
    return this.transactions;
  }
};

account.addTransaction({
  id: 1,
  amount: 1000,
  type: 'income',
  date: '2023-01-01T00:00:00Z',
  description: 'Зарплата за январь'
});

account.addTransaction({
  id: 2,
  amount: 200,
  type: 'expense',
  date: '2023-01-05T00:00:00Z',
  description: 'Покупка продуктов'
});

account.addTransaction({
  id: 3,
  amount: 150,
  type: 'expense',
  date: '2023-01-10T00:00:00Z',
  description: 'Оплата коммунальных услуг'
});

accountManager.addAccount(account);

console.log("Список всех бюджетов:", accountManager.getAccounts());
console.log("Найденный счёт:", accountManager.getAccountById(1));
console.log("Транзакции:", account.getTransactions());
console.log("Сводная информация о бюджете:", accountManager.getSummary(1));

console.log("Удаление транзакции:", account.removeTransactionById(3));
console.log("Транзакции после удаления:", account.getTransactions());

accountManager.removeAccountById(account.id);
console.log("Список всех бюджетов:", accountManager.getAccounts());

// console.log("🚀 Budget Tracker CLI");
