namespace BudgetTracker {
    export interface IAccountManager {
        addAccount(account: Account): void;
        removeAccountById(accountId: number): boolean;
        getAccountById(id: number): Account | undefined;
        getAllAccounts(): Account[];
        getSummary(): ISummary;
    }
}
