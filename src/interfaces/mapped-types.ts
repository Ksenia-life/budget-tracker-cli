import type { ITransaction } from "./ITransaction";

export type TransactionFieldType<TField> =
    TField extends keyof ITransaction
        ? ITransaction[TField]
        : never;

export type OptionalTransaction<TFields extends keyof ITransaction> =
    Omit<ITransaction, TFields> & {
        [K in TFields]?: ITransaction[K];
    };

export type ReadonlyTransactionFields<TFields extends keyof ITransaction> =
    Omit<ITransaction, TFields> & {
        readonly [K in TFields]: ITransaction[K];
    };

export type IsIncome<T> =
    T extends { type: "income" } ? true : false;
