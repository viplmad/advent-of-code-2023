import fs from 'node:fs';

export function readTextFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
}