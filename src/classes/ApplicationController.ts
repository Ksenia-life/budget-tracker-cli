import { AccountManager } from "./AccountManager";
import inquirer from "inquirer";
import { Account } from "./Account";
import { Transaction } from "./Transaction";

const prompt = inquirer.createPromptModule({
    clearPromptOnDone: true
});

export class ApplicationController {
    accountManager: AccountManager;

    private notification: string | null = null;

    private refreshScreen(): void {
        process.stdout.write("\x1b[H\x1b[2J");

        if (this.notification !== null) {
            console.log(`\n${this.notification}\n`);
            this.notification = null;
        }
    }

    constructor() {
        this.accountManager = new AccountManager();
    }
    async start(): Promise<void> {
        while (true) {
            this.refreshScreen();

            console.log("\n" + "─".repeat(36));
            console.log("       УПРАВЛЕНИЕ БЮДЖЕТОМ");
            console.log("─".repeat(36) + "\n");

            const accounts = this.accountManager.getAllAccounts();

            if (accounts.length === 0) {
                console.log("Счета: пока не созданы.\n");
            } else {
                console.log(`Создано счетов: ${accounts.length}\n`);

                accounts.forEach(account => {
                    console.log(`• ${account.name}: баланс ${account.balance} ₽`);
                });

                console.log();
            }

            const { action } = await prompt([
                {
                    type: "select",
                    name: "action",
                    message: "Выберите действие:\n",
                    choices: [
                        { name: "Счета", value: "accounts" },
                        { name: "Создать счёт", value: "create" },
                        { name: "Выйти из приложения", value: "exit" }
                    ],
                    theme: {
                        style: {
                            message: (text: string, status: "idle" | "done" | "loading") =>
                                status === "done" ? "Выбрано действие:" : text
                        }
                    }
                }
            ]);

            console.log();

            if (action === "exit") {
                console.log("Работа приложения завершена.");
                return;
            }

            if (action === "create") {
                await this.createAccount();
            } else if (action === "accounts") {
                await this.selectAccount();
            }
        }
    }
    async selectAccount(): Promise<void> {
        while (true) {
            this.refreshScreen();

            console.log("\n" + "─".repeat(36));
            console.log("             МОИ СЧЕТА");
            console.log("─".repeat(36) + "\n");

            const accounts = this.accountManager.getAllAccounts();

            if (accounts.length === 0) {
                console.log("Счета: пока не созданы.\n");
            }

            const choices = accounts.map(account => ({
                name: `${account.name}: баланс ${account.balance} ₽`,
                value: account.id
            }));

            choices.push({
                name: "← Вернуться в главное меню",
                value: "back"
            });

            const { accountId } = await prompt([
                {
                    type: "select",
                    name: "accountId",
                    message: "Выберите счёт:\n",
                    choices
                }
            ]);

            console.log();

            if (accountId === "back") {
                return;
            }

            const account = this.accountManager.getAccountById(accountId);

            if (account) {
                await this.watchAccount(account);
            }
        }
    }
    async createAccount(): Promise<void> {
        this.refreshScreen();

        console.log("─".repeat(36));
        console.log("        СОЗДАНИЕ НОВОГО СЧЁТА");
        console.log("─".repeat(36) + "\n");

        const { result } = await prompt([
            {
                type: "search",
                name: "result",
                message: "Название счёта:",

                source: async (text: string | undefined) => {
                    const name = text?.trim() ?? "";
                    return [
                        ...(name ? [{
                            name: `Создать счёт «${name}»`,
                            value: { action: "create", name }
                        }] : []),
                        {
                            name: name
                                ? "← Вернуться назад"
                                : "Напиши, чтобы вернуться назад в главное меню",
                            value: { action: "back", name: "" }
                        }
                    ];
                }
            }
        ]);

        if (result.action === "back") {
            this.notification = "Создание счёта отменено.";
            return;
        }

        const account = new Account(result.name);
        this.accountManager.addAccount(account);

        this.notification = `Счёт "${account.name}" успешно создан.`;
    }

    async watchAccount(account: Account): Promise<void> {
        while (true) {
            this.refreshScreen();

            const money = new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB"
            });

            const dates = new Intl.DateTimeFormat("ru-RU", {
                timeZone: "UTC"
            });

            console.log("\n" + "─".repeat(36));
            console.log(`СЧЁТ: ${account.name}`);
            console.log("─".repeat(36));

            console.log("\nСВОДКА ПО СЧЁТУ:\n");
            console.log(`Доходы: ${money.format(account.income)}`);
            console.log(`Расходы: ${money.format(account.expenses)}`);
            console.log(`Баланс: ${money.format(account.balance)}`);

            const transactions = account.getTransactions();

            console.log(`Количество транзакций: ${transactions.length}`);

            console.log("\n" + "─".repeat(36));
            console.log("ИСТОРИЯ ТРАНЗАКЦИЙ");
            console.log("─".repeat(36) + "\n");

            if (transactions.length === 0) {
                console.log("Транзакции пока не добавлены.\n");
            } else {
                transactions.forEach((transaction, index) => {
                    const type = transaction.type === "income" ? "Доход" : "Расход";
                    const date = dates.format(new Date(transaction.date));

                    console.log(`${index + 1}. ${type} — ${money.format(transaction.amount)}`);
                    console.log(`   ${date} · ${transaction.description}\n`);
                });
            }

            const { action } = await prompt([
                {
                    type: "select",
                    name: "action",
                    message: "Выберите действие:\n",
                    choices: [
                        { name: "Добавить транзакцию", value: "add" },
                        { name: "Удалить транзакцию", value: "remove-transaction" },
                        { name: "Экспортировать в CSV", value: "export" },
                        { name: "Удалить счёт", value: "remove-account" },
                        { name: "← Вернуться к списку счетов", value: "back" }
                    ]
                }
            ]);

            if (action === "back") {
                return;
            }
            if (action === "add") {
                await this.addTransaction(account);
            } else if (action === "remove-transaction") {
                await this.removeTransaction(account);
            } else if (action === "export") {
                await this.exportTransactionsToCSV(account);
            } else if (action === "remove-account") {
                const removed = await this.removeAccount(account);

                if (removed) {
                    return;
                }
            }
        }
    }

    async addTransaction(account: Account): Promise<void> {
        const today = new Date();

        const defaultDate = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        const { amount, type, date, description } = await prompt([
            {
                type: "number",
                name: "amount",
                message: "Введите сумму:",
                validate: (value: number | undefined) => {
                    return (typeof value === "number" &&
                        Number.isFinite(value) &&
                        value > 0) || "Сумма должна быть больше нуля.";
                }
            },
            {
                type: "select",
                name: "type",
                message: "Выберите тип транзакции:",
                choices: [
                    { name: "Доход", value: "income" },
                    { name: "Расход", value: "expense" }
                ]
            },
            {
                type: "input",
                name: "date",
                message: "Введите дату (YYYY-MM-DD):",
                default: defaultDate,
                validate: (value: string) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        return "Используйте формат YYYY-MM-DD.";
                    }

                    const parsedDate = new Date(`${value}T00:00:00Z`);

                    return (!Number.isNaN(parsedDate.getTime()) &&
                        parsedDate.toISOString().slice(0, 10) === value) ||
                        "Введите существующую дату.";
                }
            },
            {
                type: "input",
                name: "description",
                message: "Введите описание:",
                validate: (value: string) => {
                    return value.trim().length > 0 || "Описание не может быть пустым.";
                }
            }
        ]);

        const transaction = new Transaction(amount, type, date, description.trim());
        account.addTransaction(transaction);

        this.notification = "Транзакция успешно добавлена.";
    }

    async removeTransaction(account: Account): Promise<void> {
        const transactions = account.getTransactions();
        if (transactions.length === 0) {
           this.notification = "Нет транзакций для удаления.";
            return;
        }

        const choices = transactions.map(transaction => ({
            name: transaction.toString(),
            value: transaction.id
        }));

        choices.push({
            name: "Отмена",
            value: "cancel"
        });

        const { transactionId } = await prompt([
            {
                type: "select",
                name: "transactionId",
                message: "Выберите транзакцию для удаления:",
                choices
            }
        ]);

        if (transactionId === "cancel") {
            this.notification = "Удаление отменено.";
            return;
        }

        const { confirmed } = await prompt([
            {
                type: "confirm",
                name: "confirmed",
                message: "Удалить выбранную транзакцию?",
                default: false
            }
        ]);

        if (!confirmed) {
            this.notification = "Удаление отменено.";
            return;
        }

        const removed = account.removeTransactionById(transactionId);

        this.notification = removed
            ? "Транзакция успешно удалена."
            : "Не удалось удалить транзакцию.";
    }

    async removeAccount(account: Account): Promise<boolean> {
        const { confirmed } = await prompt([
            {
                type: "confirm",
                name: "confirmed",
                message: `Удалить счёт "${account.name}" со всеми транзакциями?`,
                default: false
            }
        ]);

        if (!confirmed) {
            this.notification = "Удаление счёта отменено.";
            return false;
        }

        const removed = this.accountManager.removeAccountById(account.id);

        this.notification = removed
            ? `Счёт "${account.name}" удалён.`
            : "Не удалось удалить счёт.";
        return removed;
    }

    async exportTransactionsToCSV(account: Account): Promise<void> {
        const { filename } = await prompt([
            {
                type: "input",
                name: "filename",
                message: "Введите имя CSV-файла без расширения:",
                validate: (value: string) => {
                    const name = value.trim();

                    if (name.length === 0) {
                        return "Имя файла не может быть пустым.";
                    }

                    if (name.toLowerCase().endsWith(".csv")) {
                        return "Введите имя без расширения .csv.";
                    }

                    if (!/^[\p{L}\p{N} _-]+$/u.test(name)) {
                        return "Используйте буквы, цифры, пробелы, _ или -.";
                    }

                    return true;
                }
            }
        ]);

        const file = `${filename.trim()}.csv`;
        try {
            await account.exportTransactionsToCSV(file);
            this.notification = `Транзакции успешно экспортированы в "${file}".`;
        } catch (error: unknown) {
            if (error instanceof Error) {
                this.notification = `Ошибка экспорта: ${error.message}`;
            } else {
                this.notification = "Произошла неизвестная ошибка экспорта.";
            }
        }
    }
}
