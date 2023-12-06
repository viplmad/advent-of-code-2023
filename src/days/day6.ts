import {
  readTextFile,
  splitLineByColon,
  splitNumbersTextBySpace,
  splitTextByLineBreak,
  splitTextBySpace,
} from '../utils';

export default function day6(part: string, args: string[]): unknown {
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

  const lines = splitTextByLineBreak(data);

  const timeText = lines[0];
  const { right: timeNumbersText } = splitLineByColon(timeText);
  const times = splitNumbersTextBySpace(timeNumbersText);

  const distanceText = lines[1];
  const { right: distanceNumbersText } = splitLineByColon(distanceText);
  const distances = splitNumbersTextBySpace(distanceNumbersText);

  let total = 1;
  for (let index = 0; index < times.length; index++) {
    const time = times[index];
    const record = distances[index];

    let minSpeed = 0;
    for (let speed = 1; speed < time - 1; speed++) {
      const remainingTime = time - speed;
      const totalDistance = speed * remainingTime;

      if (totalDistance > record) {
        minSpeed = speed;
        break;
      }
    }

    let maxSpeed = time;
    for (let speed = time - 1; speed > 0; speed--) {
      const remainingTime = time - speed;
      const totalDistance = speed * remainingTime;

      if (totalDistance > record) {
        maxSpeed = speed;
        break;
      }
    }

    const waysToWin = maxSpeed - minSpeed + 1;
    total *= waysToWin;
  }

  return total;
}

function part2(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  const lines = splitTextByLineBreak(data);

  const timeText = lines[0];
  const { right: timeNumbersText } = splitLineByColon(timeText);
  const timesJoin = splitTextBySpace(timeNumbersText).join('');
  const time = parseInt(timesJoin);

  const distanceText = lines[1];
  const { right: distanceNumbersText } = splitLineByColon(distanceText);
  const distancesJoin = splitTextBySpace(distanceNumbersText).join('');
  const record = parseInt(distancesJoin);

  let minSpeed = 0;
  for (let speed = 1; speed < time - 1; speed++) {
    const remainingTime = time - speed;
    const totalDistance = speed * remainingTime;

    if (totalDistance > record) {
      minSpeed = speed;
      break;
    }
  }

  let maxSpeed = time;
  for (let speed = time - 1; speed > 0; speed--) {
    const remainingTime = time - speed;
    const totalDistance = speed * remainingTime;

    if (totalDistance > record) {
      maxSpeed = speed;
      break;
    }
  }

  const waysToWin = maxSpeed - minSpeed + 1;

  return waysToWin;
}
