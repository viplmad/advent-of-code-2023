import fs from 'node:fs';

const REGEX_NUMBER = /[\d]/g;
const REGEX_IS_NUMBER = /^\d+$/;

export function readTextFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function splitLines(data: string): string[] {
  return data.split('\n').filter((text) => !!text);
}

export function isNumber(text: string): boolean {
  return REGEX_IS_NUMBER.test(text);
}

export function filterNumbers(text: string): string[] | null {
  return text.match(REGEX_NUMBER);
}
