import day1 from './days/day1';
import day2 from './days/day2';
import day3 from './days/day3';
import day4 from './days/day4';
import day5 from './days/day5';
import day6 from './days/day6';
import day7 from './days/day7';

const args = process.argv ?? [];

if (args.length <= 4) {
  throw new Error('Invalid init args');
}

const day = args[2];
const part = args[3];
const dayArgs = args.slice(4) ?? [];

let result: unknown;
switch (day) {
  case '1':
    result = day1(part, dayArgs);
    break;
  case '2':
    result = day2(part, dayArgs);
    break;
  case '3':
    result = day3(part, dayArgs);
    break;
  case '4':
    result = day4(part, dayArgs);
    break;
  case '5':
    result = day5(part, dayArgs);
    break;
  case '6':
    result = day6(part, dayArgs);
    break;
  case '7':
    result = day7(part, dayArgs);
    break;
}

if (result) {
  console.log('Day %s, Part %s -> %s', day, part, result);
} else {
  console.warn('Not implemented yet');
}
