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

    const entry = buildMapRange(line);

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

  let source: Range[] = [];
  let dest: Range[] = [];

  const lines = splitLines(data);
  for (const line of lines) {
    if (line.startsWith('seeds')) {
      const sections = line.split(':');
      const numbersSection = sections[1];
      const numbers = buildNumbers(numbersSection);
      for (let index = 0; index < numbers.length; index += 2) {
        const number = numbers[index];
        const numberRange = numbers[index + 1];
        source.push({
          rangeStart: number,
          rangeEnd: number + numberRange - 1,
        });
      }

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
      source = defaultRangesFromSource(source, dest);
      dest = [];

      continue;
    }

    const entry = buildMapRange(line);

    const additionalUnchangedRanges: Range[] = [];
    for (let index = 0; index < source.length; index++) {
      const sourceRange = source[index];

      const { unchangedRanges, mappedRange } = nextRangesWithMapEntry(
        sourceRange,
        entry
      );
      // Marcamos como inválido
      source[index] = { rangeStart: -1, rangeEnd: -1 };

      additionalUnchangedRanges.push(...unchangedRanges);

      if (mappedRange) {
        dest.push(mappedRange);
      }
    }
    source.push(...additionalUnchangedRanges);
    source = source.filter((s) => s.rangeStart > 0 && s.rangeEnd > 0);
  }

  const final = defaultRangesFromSource(source, dest)
    .map((val) => val.rangeStart)
    .filter((num) => num > 0);
  return Math.min(...final);
}

interface MapRange {
  source: Range;
  dest: Range;
  rangeLength: number;
}

interface Range {
  /** Inclusive */
  rangeStart: number;
  /** Inclusive */
  rangeEnd: number;
}

function defaultFromSource(source: number[], dest: number[]): number[] {
  return source.map((val, index) => {
    return dest[index] ?? val;
  });
}

function defaultRangesFromSource(source: Range[], dest: Range[]): Range[] {
  return [...dest, ...source];
}

function nextWithMapEntry(value: number, entry: MapRange): number | null {
  const sourceRangeStart = entry.source.rangeStart;
  const sourceRangeEnd = entry.source.rangeEnd;
  if (value >= sourceRangeStart && value <= sourceRangeEnd) {
    return value - sourceRangeStart + entry.dest.rangeStart;
  }

  return null;
}

function nextRangesWithMapEntry(
  range: Range,
  entry: MapRange
): { unchangedRanges: Range[]; mappedRange: Range | null } {
  const sourceRangeStart = entry.source.rangeStart;
  const sourceRangeEnd = entry.source.rangeEnd;

  if (range.rangeEnd < sourceRangeStart || range.rangeStart > sourceRangeEnd) {
    // Fuera de rango
    return { unchangedRanges: [range], mappedRange: null };
  }

  if (range.rangeStart < sourceRangeStart && range.rangeEnd <= sourceRangeEnd) {
    const unchangedRange: Range = {
      rangeStart: range.rangeStart,
      rangeEnd: sourceRangeStart - 1,
    };

    const mappedRange: Range = {
      rangeStart: entry.dest.rangeStart,
      rangeEnd: entry.dest.rangeEnd - (sourceRangeEnd - range.rangeEnd),
    };

    return { unchangedRanges: [unchangedRange], mappedRange };
  }

  if (range.rangeStart >= sourceRangeStart && range.rangeEnd > sourceRangeEnd) {
    const unchangedRange: Range = {
      rangeStart: sourceRangeEnd + 1,
      rangeEnd: range.rangeEnd,
    };

    const mappedRange: Range = {
      rangeStart: entry.dest.rangeStart + (range.rangeStart - sourceRangeStart),
      rangeEnd: entry.dest.rangeEnd,
    };

    return { unchangedRanges: [unchangedRange], mappedRange };
  }

  if (
    range.rangeStart >= sourceRangeStart &&
    range.rangeEnd <= sourceRangeEnd
  ) {
    const mappedRange: Range = {
      rangeStart: entry.dest.rangeStart + (range.rangeStart - sourceRangeStart),
      rangeEnd: entry.dest.rangeEnd - (sourceRangeEnd - range.rangeEnd),
    };

    return { unchangedRanges: [], mappedRange };
  }

  if (range.rangeStart < sourceRangeStart && range.rangeEnd > sourceRangeEnd) {
    const unchangedRangeBefore: Range = {
      rangeStart: range.rangeStart,
      rangeEnd: sourceRangeStart - 1,
    };

    const unchangedRangeAfter: Range = {
      rangeStart: sourceRangeEnd + 1,
      rangeEnd: range.rangeEnd,
    };

    const mappedRange: Range = {
      rangeStart: entry.dest.rangeStart,
      rangeEnd: entry.dest.rangeEnd,
    };

    return {
      unchangedRanges: [unchangedRangeBefore, unchangedRangeAfter],
      mappedRange,
    };
  }

  throw new Error('Impossible');
}

function buildMapRange(text: string): MapRange {
  const numbers = buildNumbers(text);
  const destRangeStart = numbers[0];
  const sourceRangeStart = numbers[1];
  const rangeLength = numbers[2];

  return {
    source: {
      rangeStart: sourceRangeStart,
      rangeEnd: sourceRangeStart + rangeLength - 1,
    },
    dest: {
      rangeStart: destRangeStart,
      rangeEnd: destRangeStart + rangeLength - 1,
    },
    rangeLength,
  };
}

function buildNumbers(text: string): number[] {
  return text
    .split(' ')
    .map((text) => text.trim())
    .filter((text) => !!text)
    .map((text) => parseInt(text));
}
