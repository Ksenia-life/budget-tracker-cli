interface Identifiable {
    id: number;
}

interface Describable {
    describe(): string;
}

class GenericStorage<T extends Identifiable> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }
    
    removeById(id: number): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    getById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }

    getAll(): T[] {
        return [...this.items];
    }

    describeAll(): void {
        this.items.forEach(item => {
            if ('describe' in item && typeof item.describe === 'function') {
                console.log(item.describe());
            } else {
                console.log(`Элемент id: ${item.id} не содержит описания.`);
            }
        });
    }
}

class Product implements Identifiable, Describable {
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    describe(): string {
        return `Product #${this.id}: ${this.name}, price: $${this.price}`;
    }
}

const productStorage = new GenericStorage<Product>();

productStorage.add(new Product(1, "Laptop", 999.99));
productStorage.add(new Product(2, "Mouse", 29.99));

console.log('--- Описание продуктов ---');
productStorage.describeAll();

productStorage.add({ id: 3 } as Product);

console.log('--- Описание продуктов после добавления объекта без describe ---');
productStorage.describeAll();