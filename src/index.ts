import { Account } from "./classes/Account";
import { Transaction } from "./classes/Transaction";
import { AccountManager } from "./classes/AccountManager";

const personalAccount = new Account("Личный бюджет");

const transaction1 = new Transaction(
    1000,
    "income",
    "2023-01-01T00:00:00Z",
    "Зарплата за январь"
);

const transaction2 = new Transaction(
    200,
    "expense",
    "2023-01-05T00:00:00Z",
    "Покупка продуктов"
);

const transaction3 = new Transaction(
    150,
    "expense",
    "2023-01-10T00:00:00Z",
    "Оплата коммунальных услуг"
);

personalAccount.addTransaction(transaction1);
personalAccount.addTransaction(transaction2);
personalAccount.addTransaction(transaction3);

const manager = new AccountManager();

manager.addAccount(personalAccount);

console.log("Список всех бюджетов:", manager.getAllAccounts());
console.log("Найденный счёт:", manager.getAccountById(personalAccount.id));
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
    personalAccount.removeTransactionById(transaction3.id)
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
