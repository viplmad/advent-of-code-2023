import { filterNumbers, readTextFile, splitLines } from '../utils';

export default function day2(part: string, args: string[]): unknown {
  switch (part) {
    case '1':
      return part1(args);
    case '2':
      return part2(args);
  }
}

const DEFAULT_MAX_RED_BALLS = 12;
const DEFAULT_MAX_GREEN_BALLS = 13;
const DEFAULT_MAX_BLUE_BALLS = 14;

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

    const gameText = sections[0];
    const gameId = readNumber(gameText);

    let isValid = true;
    const ballsText = sections[1];
    const ballsSections = ballsText.split(';');
    for (const balls of ballsSections) {
      const ballsTexts = balls.split(',');

      let redBalls = 0;
      let greenBalls = 0;
      let blueBalls = 0;
      for (const ballText of ballsTexts) {
        if (ballText.includes('red')) {
          redBalls += readNumber(ballText);
        }
        if (ballText.includes('green')) {
          greenBalls += readNumber(ballText);
        }
        if (ballText.includes('blue')) {
          blueBalls += readNumber(ballText);
        }
      }

      if (
        redBalls > DEFAULT_MAX_RED_BALLS ||
        greenBalls > DEFAULT_MAX_GREEN_BALLS ||
        blueBalls > DEFAULT_MAX_BLUE_BALLS
      ) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      total += gameId;
    }
  }

  return total;
}

function part2(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  let total = 0;
  const lines = splitLines(data);
  for (const line of lines) {
    const sections = line.split(':');

    let minRedBalls = 0;
    let minGreenBalls = 0;
    let minBlueBalls = 0;

    const ballsText = sections[1];
    const ballsSections = ballsText.split(';');
    for (const balls of ballsSections) {
      const ballsTexts = balls.split(',');

      let redBalls = 0;
      let greenBalls = 0;
      let blueBalls = 0;
      for (const ballText of ballsTexts) {
        if (ballText.includes('red')) {
          redBalls += readNumber(ballText);
        }
        if (ballText.includes('green')) {
          greenBalls += readNumber(ballText);
        }
        if (ballText.includes('blue')) {
          blueBalls += readNumber(ballText);
        }
      }

      if (redBalls > minRedBalls) {
        minRedBalls = redBalls;
      }
      if (greenBalls > minGreenBalls) {
        minGreenBalls = greenBalls;
      }
      if (blueBalls > minBlueBalls) {
        minBlueBalls = blueBalls;
      }
    }

    total += minRedBalls * minGreenBalls * minBlueBalls;
  }

  return total;
}

// seguramente haya mejores formas de sacar el num
function readNumber(text: string): number {
  const numbersFound = filterNumbers(text);
  if (!numbersFound || numbersFound.length === 0) {
    throw new Error('Number not found');
  }

  return parseInt(numbersFound.join(''));
}
