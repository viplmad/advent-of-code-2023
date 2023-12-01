import day1 from './days/day1';

const args = process.argv ?? [];

if (args.length <= 4) {
    throw new Error("Invalid init args");
}

const day = args[2];
const part = args[3];
const dayArgs = args.slice(4) ?? [];

let result: unknown;
switch (day) {
    case '1':
        result = day1(part, dayArgs);
        break;
}

if (result) {
    console.log('Day %s, Part %s -> %s', day, part, result);
} else {
    console.warn('Not implemented yet')
}