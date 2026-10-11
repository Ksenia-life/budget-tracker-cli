import { Account } from "./classes/Account";
import { Transaction } from "./classes/Transaction";
import { AccountManager } from "./classes/AccountManager";
import type {
    CategoryLimits,
    TransactionConstructorParams,
    TransactionInstance,
    NullableDescription,
    CompleteTransaction,
    TransactionWithoutDescription,
    TransactionPreview,
    AccountInfo
} from "./interfaces/utility-types";

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

transaction1.update({ amount: 1200 });
personalAccount.update({ name: "Основной счёт" });

console.log("Обновлённая транзакция:", transaction1.toString());
console.log("Обновлённое название счёта:", personalAccount.name);

const completeTransaction: CompleteTransaction = transaction1;

const transactionWithoutDescription: TransactionWithoutDescription = {
    id: completeTransaction.id,
    amount: completeTransaction.amount,
    type: completeTransaction.type,
    date: completeTransaction.date
};

const transactionPreview: TransactionPreview = transactionWithoutDescription;

const accountInfo: AccountInfo = {
    id: personalAccount.id,
    name: personalAccount.name
};

console.log("Транзакция без описания:", transactionWithoutDescription);
console.log("Краткая информация о транзакции:", transactionPreview);
console.log("Информация о счёте:", accountInfo);

personalAccount.addTransaction(transaction1);
personalAccount.addTransaction(transaction2);
personalAccount.addTransaction(transaction3);

const limits: CategoryLimits = {
    income: 10000,
    expense: 5000
};

console.log("Лимит пополнений:", limits.income);
console.log("Лимит трат:", limits.expense);

const manager = new AccountManager();

manager.addAccount(personalAccount);

const nullableDescription: NullableDescription = null;

console.log("Описание транзакции:", nullableDescription ?? "Не указано");

const transactionParams: TransactionConstructorParams = [
    500,
    "expense",
    "2023-02-01T00:00:00Z",
    "Покупка"
];

const newTransaction: TransactionInstance = new Transaction(...transactionParams);

console.log("Новая транзакция:", newTransaction.toString());

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

console.log(`\nТранзакции счёта "${personalAccount.name}":`);
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
