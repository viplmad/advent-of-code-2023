import { isNumber, readTextFile, splitLines } from '../utils';

export default function day1(part: string, args: string[]): unknown {
  switch (part) {
    case '1':
      return part1(args);
  }
}

const REGEX_NOT_NUMBER_NOT_DOT = /[^.\d]/g;

function part1(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  const usedSpaces: boolean[][] = [];

  let total = 0;
  const lines = splitLines(data);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    let symbolMatch;
    while ((symbolMatch = REGEX_NOT_NUMBER_NOT_DOT.exec(line)) !== null) {
      const symbolIndex = symbolMatch.index;

      findNumbersIn(lines, index - 1, symbolIndex, usedSpaces).forEach(
        (num) => (total += num)
      );
      findNumbersIn(lines, index, symbolIndex, usedSpaces).forEach(
        (num) => (total += num)
      );
      findNumbersIn(lines, index + 1, symbolIndex, usedSpaces).forEach(
        (num) => (total += num)
      );
    }
  }

  return total;
}

function findNumbersIn(
  lines: string[],
  lineIndex: number,
  symbolIndex: number,
  usedSpaces: boolean[][]
): number[] {
  const nums: number[] = [];

  if (lineIndex < 0 || lineIndex >= lines.length) {
    return nums;
  }
  const line = lines[lineIndex];

  const prevNum = findWholeNumberIn(
    line,
    lineIndex,
    symbolIndex - 1,
    usedSpaces
  );
  prevNum && nums.push(prevNum);

  const num = findWholeNumberIn(line, lineIndex, symbolIndex, usedSpaces);
  num && nums.push(num);

  const nextNum = findWholeNumberIn(
    line,
    lineIndex,
    symbolIndex + 1,
    usedSpaces
  );
  nextNum && nums.push(nextNum);

  return nums;
}

function findWholeNumberIn(
  line: string,
  lineIndex: number,
  fromIndex: number,
  usedSpaces: boolean[][]
): number | null {
  if (fromIndex < 0 || fromIndex >= line.length) {
    return null;
  }
  if (!isNumber(line[fromIndex])) {
    return null;
  }

  let result = '';
  const lineUsedSpaces = usedSpaces[lineIndex] ?? [];

  for (let index = fromIndex - 1; index >= 0; index--) {
    if (lineUsedSpaces[index]) {
      return null;
    }

    const char = line[index];
    if (isNumber(char)) {
      result = char + result;
      lineUsedSpaces[index] = true;
    } else {
      break;
    }
  }

  if (lineUsedSpaces[fromIndex]) {
    return null;
  }
  lineUsedSpaces[fromIndex] = true;

  result = result + line[fromIndex];

  for (let index = fromIndex + 1; index < line.length; index++) {
    if (lineUsedSpaces[index]) {
      return null;
    }

    const char = line[index];
    if (isNumber(char)) {
      result = result + char;
      lineUsedSpaces[index] = true;
    } else {
      break;
    }
  }

  usedSpaces[lineIndex] = lineUsedSpaces;
  return parseInt(result);
}
