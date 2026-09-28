function calculateTotal(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
    }
  
  const total = calculateTotal(values);
  return total / values.length;
}

function formatCurrency(amount: number, symbol: string): string {
    return `${amount} ${symbol}`;
}

function getTopValues(values: number[], count: number): number[] {
    const sortedValues = [...values].sort((a, b) => b - a);

    return sortedValues.slice(0, count);
}

function printSummary(values: number[]): void {
    console.log("Всего записей:", values.length);
    console.log("Сумма:", calculateTotal(values));
    console.log("Среднее значение:", calculateAverage(values));
} 

console.log(calculateTotal([1000, 2000, 3000]));
console.log(calculateAverage([1000, 2000, 3000]));
console.log(formatCurrency(5000, "₽"));
console.log(getTopValues([100, 500, 200, 800], 2));
printSummary([100, 500, 1000, 2000, 800]);
