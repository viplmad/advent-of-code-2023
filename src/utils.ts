import fs from 'node:fs';

export const REGEX_NUMBER = /[\d]/g;

export function readTextFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
}

export function splitLines(data: string): string[] {
    return data.split('\n').filter(text => !!text);
}