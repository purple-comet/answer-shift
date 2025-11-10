export function cleanUpInput(text: string): string {
    return text
        .replace(/(\r)?\n/g, '')
        .replace(/\s+/g, '');
}
