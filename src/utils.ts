import fs from 'node:fs';

const REGEX_NUMBER = /[\d]/g;
const REGEX_IS_NUMBER = /^\d+$/;

export function readTextFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function splitTextByLineBreak(data: string): string[] {
  return data.split('\n').filter((text) => !!text);
}

export function splitLineByColon(data: string): {
  left: string;
  right: string;
} {
  const sections = data.split(':');
  return { left: sections[0], right: sections[1] };
}

export function splitTextBySpace(data: string): string[] {
  return data
    .split(' ')
    .map((text) => text.trim())
    .filter((text) => !!text);
}

export function splitNumbersTextBySpace(data: string): number[] {
  return splitTextBySpace(data).map((text) => parseInt(text));
}

export function isNumber(data: string): boolean {
  return REGEX_IS_NUMBER.test(data);
}

export function filterNumbers(data: string): string[] | null {
  return data.match(REGEX_NUMBER);
}
