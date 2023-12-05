import { readTextFile, splitLines } from '../utils';

export default function day4(part: string, args: string[]): unknown {
  switch (part) {
    case '1':
      return part1(args);
    case '2':
      return part2(args);
  }
}

function part1(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  let total = 0;
  const lines = splitLines(data);
  for (const line of lines) {
    const sections = line.split(':');
    const numbers = sections[1];

    const numbersSections = numbers.split('|');
    const winnerNums = numbersSections[0]
      .split(' ')
      .map((text) => text.trim())
      .filter((text) => !!text);
    const cardNums = numbersSections[1]
      .split(' ')
      .map((text) => text.trim())
      .filter((text) => !!text);

    const cardWinnerNums = cardNums.filter((num) => winnerNums.includes(num));

    const cardTotal = cardWinnerNums.reduce((acc, _val, index) => {
      if (index === 0) {
        return 1;
      }
      acc = acc * 2;
      return acc;
    }, 0);

    total += cardTotal;
  }

  return total;
}

function part2(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  const cardCopies: number[] = [];

  let total = 0;
  const lines = splitLines(data);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    const sections = line.split(':');
    const numbers = sections[1];

    const numbersSections = numbers.split('|');
    const winnerNums = numbersSections[0]
      .split(' ')
      .map((text) => text.trim())
      .filter((text) => !!text);
    const cardNums = numbersSections[1]
      .split(' ')
      .map((text) => text.trim())
      .filter((text) => !!text);

    const cardWinnerNums = cardNums.filter((num) => winnerNums.includes(num));

    const cardAmount = (cardCopies[index] ?? 0) + 1;
    for (let copyIndex = 0; copyIndex < cardWinnerNums.length; copyIndex++) {
      const cardCopyIndex = index + copyIndex + 1;
      const currentCopies = cardCopies[cardCopyIndex] ?? 0;
      cardCopies[cardCopyIndex] = currentCopies + cardAmount;
    }

    total += cardAmount;
  }

  return total;
}
