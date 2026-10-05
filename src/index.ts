/// <reference path="./classes/Transaction.ts" />
/// <reference path="./classes/Account.ts" />
/// <reference path="./classes/AccountManager.ts" />

const personalAccount = new BudgetTracker.Account(1, "Личный бюджет");

personalAccount.addTransaction(
    new BudgetTracker.Transaction(
        1,
        1000,
        "income",
        "2023-01-01T00:00:00Z",
        "Зарплата за январь"
    )
);

personalAccount.addTransaction(
    new BudgetTracker.Transaction(
        2,
        200,
        "expense",
        "2023-01-05T00:00:00Z",
        "Покупка продуктов"
    )
);

personalAccount.addTransaction(
    new BudgetTracker.Transaction(
        3,
        150,
        "expense",
        "2023-01-10T00:00:00Z",
        "Оплата коммунальных услуг"
    )
);

const manager = new BudgetTracker.AccountManager();

manager.addAccount(personalAccount);

console.log("Список всех бюджетов:", manager.getAllAccounts());
console.log("Найденный счёт:", manager.getAccountById(1));
console.log("Транзакции:", personalAccount.getTransactions());

console.log(
    "Сводная информация о бюджете:",
    personalAccount.getSummary()
);

console.log(
    "Общая сводная информация:",
    manager.getSummary()
);

console.log(
    "Краткая информация о счёте:",
    personalAccount.getSummaryString()
);

console.log(
    "Краткая информация обо всех счетах:",
    manager.getSummaryString()
);

console.log("\nСтроковое представление счёта:");
console.log(String(personalAccount));

console.log("\nСтроковое представление всех бюджетов:");
console.log(String(manager));

console.log("\nТранзакции личного бюджета:");
personalAccount
    .getTransactions()
    .forEach(transaction => console.log(transaction.toString()));

console.log(
    "Удаление транзакции:",
    personalAccount.removeTransactionById(3)
);

console.log(
    "Транзакции после удаления:",
    personalAccount.getTransactions()
);

console.log(
    "Удаление счёта:",
    manager.removeAccountById(personalAccount.id)
);

console.log(
    "Список всех бюджетов после удаления:",
    manager.getAllAccounts()
);

// console.log("🚀 Budget Tracker CLI");
