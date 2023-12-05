import { readTextFile, splitLines } from '../utils';

export default function day5(part: string, args: string[]): unknown {
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

  let source: number[] = [];
  let dest: number[] = [];

  const lines = splitLines(data);
  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const sections = line.split(':');
      const numbersSection = sections[1];
      source = buildNumbers(numbersSection);

      continue;
    }

    if (
      line.startsWith('seed-to-soil') ||
      line.startsWith('soil-to-fertilizer') ||
      line.startsWith('fertilizer-to-water') ||
      line.startsWith('water-to-light') ||
      line.startsWith('light-to-temperature') ||
      line.startsWith('temperature-to-humidity') ||
      line.startsWith('humidity-to-location')
    ) {
      source = defaultFromSource(source, dest);
      dest = [];

      continue;
    }

    const entry = buildMapEntry(line);

    for (let index = 0; index < source.length; index++) {
      const sourceElement = source[index];
      const destElement = nextWithMapEntry(sourceElement, entry);
      if (destElement) {
        dest[index] = destElement;
      }
    }
  }

  const final = defaultFromSource(source, dest);
  return Math.min(...final);
}

function part2(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  return 0;
}

function defaultFromSource(source: number[], dest: number[]): number[] {
  return source.map((val, index) => {
    return dest[index] ?? val;
  });
}

function nextWithMapEntry(
  value: number,
  entry: {
    destRangeStart: number;
    sourceRangeStart: number;
    rangeLength: number;
  }
): number | null {
  const sourceRangeStart = entry.sourceRangeStart;
  const sourceRangeEnd = sourceRangeStart + entry.rangeLength;
  if (value >= sourceRangeStart && value < sourceRangeEnd) {
    return value - sourceRangeStart + entry.destRangeStart;
  }

  return null;
}

function buildMapEntry(text: string): {
  destRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
} {
  const numbers = buildNumbers(text);

  return {
    destRangeStart: numbers[0],
    sourceRangeStart: numbers[1],
    rangeLength: numbers[2],
  };
}

function buildNumbers(text: string): number[] {
  return text
    .split(' ')
    .map((text) => text.trim())
    .filter((text) => !!text)
    .map((text) => parseInt(text));
}
