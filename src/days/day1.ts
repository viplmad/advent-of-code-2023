import { readTextFile } from '../utils';

export default function day1(part: string, args: string[]): unknown {
    switch (part) {
        case '1':
            return day1Part1(args);
        case '2':
            return day1Part2(args);
    }
}

const REGEX_NUMBER = /[\d]/g;

function day1Part1(args: string[]): unknown {
    if (args.length < 1) {
        throw new Error("Invalid args");
    }

    const filePath = args[0];
    const data = readTextFile(filePath);

    let total = 0;
    const lines = data.split('\n');
    for (const line of lines) {
        const numbersFound = line.match(REGEX_NUMBER);
        if (!numbersFound || numbersFound.length === 0) {
            throw new Error("Invalid");
        }

        const firstNum = parseInt(numbersFound[0]);
        const lastNum = parseInt(numbersFound[numbersFound.length - 1]);
        const num = (firstNum * 10) + lastNum;

        total += num;
    }

    return total;
}

function day1Part2(args: string[]): unknown {
    if (args.length < 1) {
        throw new Error("Invalid args");
    }

    const filePath = args[0];
    const data = readTextFile(filePath);

    let total = 0;
    const lines = data.split('\n');
    for (const line of lines) {
        let firstNum: number | null = null;
        let standardLine = '';
        for (let index = 0; index < line.length; index++) {
            standardLine = standardLine + line[index];

            standardLine = standardLine
                .replace('one', '1')
                .replace('two', '2')
                .replace('three', '3')
                .replace('four', '4')
                .replace('five', '5')
                .replace('six', '6')
                .replace('seven', '7')
                .replace('eight', '8')
                .replace('nine', '9');

            const numbersFound = standardLine.match(REGEX_NUMBER);
            if (numbersFound && numbersFound.length > 0) {
                firstNum = parseInt(numbersFound[0]);
                break;
            }
        }

        let lastNum: number | null = null;
        standardLine = '';
        for (let index = line.length - 1; index >= 0; index--) {
            standardLine = line[index] + standardLine;

            standardLine = standardLine
                .replace('one', '1')
                .replace('two', '2')
                .replace('three', '3')
                .replace('four', '4')
                .replace('five', '5')
                .replace('six', '6')
                .replace('seven', '7')
                .replace('eight', '8')
                .replace('nine', '9');

            const numbersFound = standardLine.match(REGEX_NUMBER);
            if (numbersFound && numbersFound.length > 0) {
                lastNum = parseInt(numbersFound[0]);
                break;
            }
        }

        if (!firstNum || !lastNum) {
            throw new Error("Invalid");
        }

        const num = (firstNum * 10) + lastNum;

        total += num;
    }

    return total;
}