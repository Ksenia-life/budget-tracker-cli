export function escapeCsvValue(value: string | number): string {
    const text = String(value);

    const needsQuotes =
        text.includes(",") ||
        text.includes("'") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r");

    if (needsQuotes) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}
