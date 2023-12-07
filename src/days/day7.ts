import { readTextFile, splitTextByLineBreak, splitTextBySpace } from '../utils';

export default function day7(part: string, args: string[]): unknown {
  switch (part) {
    case '1':
      return part1(args);
    case '2':
      return part2(args);
  }
}

const POINTS_FIVE_OF_A_KIND = 6000;
const POINTS_FOUR_OF_A_KIND = 5000;
const POINTS_FULL_HOUSE = 4000;
const POINTS_THREE_OF_A_KIND = 3000;
const POINTS_TWO_PAIR = 2000;
const POINTS_ONE_PAIR = 1000;
const POINTS_HIGH_CARD = 0;

const PART_1_POINTS_CARD_MAP: { [key: string]: number } = {
  A: 15,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

const PART_2_POINTS_CARD_MAP: { [key: string]: number } = {
  A: 15,
  K: 13,
  Q: 12,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  J: 1,
};

function part1(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  const handPoints: {
    typePoints: number;
    cardPoints: number[];
    bid: number;
  }[] = [];

  const lines = splitTextByLineBreak(data);
  for (const line of lines) {
    const sections = splitTextBySpace(line);
    const hand = sections[0];
    const bid = parseInt(sections[1]);

    let points = 0;

    const firstCard = hand[0];
    const amountOfFirstCard = amountOfOcurrences(hand, firstCard);
    if (amountOfFirstCard === 5) {
      // Five of a kind
      points += POINTS_FIVE_OF_A_KIND;
    }
    if (amountOfFirstCard === 4) {
      // Four of a kind
      points += POINTS_FOUR_OF_A_KIND;
    }
    if (amountOfFirstCard === 3) {
      const otherCards = [...hand].filter((card) => card !== firstCard);
      const otherCard = otherCards[0];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 2) {
        // Full house
        points += POINTS_FULL_HOUSE;
      }
      if (amountOfOtherCard === 1) {
        // Three of a kind
        points += POINTS_THREE_OF_A_KIND;
      }
    }
    if (amountOfFirstCard === 2) {
      const otherCards = [...hand].filter((card) => card !== firstCard);
      const otherCard = otherCards[0];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 3) {
        // Full house
        points += POINTS_FULL_HOUSE;
      }
      if (amountOfOtherCard === 2) {
        // Two pair
        points += POINTS_TWO_PAIR;
      }
      if (amountOfOtherCard === 1) {
        const otherSecondCard = otherCards[1];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 2) {
          // Two pair
          points += POINTS_TWO_PAIR;
        }
        if (amountOfOtherSecondCard === 1) {
          // One pair
          points += POINTS_ONE_PAIR;
        }
      }
    }
    if (amountOfFirstCard === 1) {
      const otherCard = hand[1];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 4) {
        // Four of a kind
        points += POINTS_FOUR_OF_A_KIND;
      }
      if (amountOfOtherCard === 3) {
        // Three of a kind
        points += POINTS_THREE_OF_A_KIND;
      }
      if (amountOfOtherCard === 2) {
        const otherCards = [...hand].filter(
          (card) => card !== firstCard && card !== otherCard
        );
        const otherSecondCard = otherCards[0];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 2) {
          // Two pair
          points += POINTS_TWO_PAIR;
        }
        if (amountOfOtherSecondCard === 1) {
          // One pair
          points += POINTS_ONE_PAIR;
        }
      }
      if (amountOfOtherCard === 1) {
        const otherSecondCard = hand[2];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 3) {
          // Three of a kind
          points += POINTS_THREE_OF_A_KIND;
        }
        if (amountOfOtherSecondCard === 2) {
          // One pair
          points += POINTS_ONE_PAIR;
        }
        if (amountOfOtherSecondCard === 1) {
          const otherThirdCard = hand[3];
          const amountOfOtherThirdCard = amountOfOcurrences(
            hand,
            otherThirdCard
          );
          if (amountOfOtherThirdCard === 2) {
            // One pair
            points += POINTS_ONE_PAIR;
          }
          if (amountOfOtherThirdCard === 1) {
            // High card
            points += POINTS_HIGH_CARD;
          }
        }
      }
    }

    handPoints.push({
      typePoints: points,
      cardPoints: [...hand].map((card) => PART_1_POINTS_CARD_MAP[card]),
      bid: bid,
    });
  }

  handPoints.sort((a, b) => {
    const compType = a.typePoints - b.typePoints;
    if (compType === 0) {
      for (let index = 0; index < a.cardPoints.length; index++) {
        const compCard = a.cardPoints[index] - b.cardPoints[index];
        if (compCard === 0) {
          continue;
        }
        return compCard;
      }
      return 0;
    }
    return compType;
  });

  let total = 0;
  for (let index = 0; index < handPoints.length; index++) {
    const points = handPoints[index];
    const bid = points.bid;

    total += bid * (index + 1);
  }

  return total;
}

function part2(args: string[]): unknown {
  if (args.length < 1) {
    throw new Error('Invalid args');
  }

  const filePath = args[0];
  const data = readTextFile(filePath);

  const handPoints: {
    typePoints: number;
    cardPoints: number[];
    bid: number;
  }[] = [];

  const lines = splitTextByLineBreak(data);
  for (const line of lines) {
    const sections = splitTextBySpace(line);
    const hand = sections[0];
    const bid = parseInt(sections[1]);

    let maxEqual = 1;
    let otherMaxEqual = 1;

    const amountOfJoker = amountOfOcurrences(hand, 'J');
    const handWithoutJoker = [...hand].filter((card) => card !== 'J');
    const firstCard = handWithoutJoker[0];
    const amountOfFirstCard = amountOfOcurrences(hand, firstCard);
    if (amountOfFirstCard === 5) {
      maxEqual = 5;
    }
    if (amountOfFirstCard === 4) {
      maxEqual = 4;
    }
    if (amountOfFirstCard === 3) {
      maxEqual = 3;

      const otherCards = [...handWithoutJoker].filter(
        (card) => card !== firstCard
      );
      const otherCard = otherCards[0];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 2) {
        otherMaxEqual = 2;
      }
      if (amountOfOtherCard === 1) {
        otherMaxEqual = 1;
      }
    }
    if (amountOfFirstCard === 2) {
      maxEqual = 2;

      const otherCards = [...handWithoutJoker].filter(
        (card) => card !== firstCard
      );
      const otherCard = otherCards[0];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 3) {
        maxEqual = 3;
        otherMaxEqual = 2;
      }
      if (amountOfOtherCard === 2) {
        maxEqual = 2;
        otherMaxEqual = 2;
      }
      if (amountOfOtherCard === 1) {
        maxEqual = 2;
        const otherSecondCard = otherCards[1];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 2) {
          otherMaxEqual = 2;
        }
        if (amountOfOtherSecondCard === 1) {
          otherMaxEqual = 1;
        }
      }
    }
    if (amountOfFirstCard === 1) {
      const otherCard = handWithoutJoker[1];
      const amountOfOtherCard = amountOfOcurrences(hand, otherCard);
      if (amountOfOtherCard === 4) {
        maxEqual = 4;
      }
      if (amountOfOtherCard === 3) {
        maxEqual = 3;
      }
      if (amountOfOtherCard === 2) {
        maxEqual = 2;
        const otherCards = [...handWithoutJoker].filter(
          (card) => card !== firstCard && card !== otherCard
        );
        const otherSecondCard = otherCards[0];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 2) {
          otherMaxEqual = 2;
        }
        if (amountOfOtherSecondCard === 1) {
          otherMaxEqual = 1;
        }
      }
      if (amountOfOtherCard === 1) {
        const otherSecondCard = handWithoutJoker[2];
        const amountOfOtherSecondCard = amountOfOcurrences(
          hand,
          otherSecondCard
        );
        if (amountOfOtherSecondCard === 3) {
          maxEqual = 3;
        }
        if (amountOfOtherSecondCard === 2) {
          maxEqual = 2;
        }
        if (amountOfOtherSecondCard === 1) {
          const otherThirdCard = handWithoutJoker[3];
          const amountOfOtherThirdCard = amountOfOcurrences(
            hand,
            otherThirdCard
          );
          if (amountOfOtherThirdCard === 2) {
            maxEqual = 2;
          }
          if (amountOfOtherThirdCard === 1) {
            maxEqual = 1;
          }
        }
      }
    }

    let points = 0;
    if (amountOfJoker === 5 || maxEqual === 5) {
      // Five of a kind
      points += POINTS_FIVE_OF_A_KIND;
    }
    if (maxEqual === 4) {
      if (amountOfJoker === 1) {
        // Five of a kind
        points += POINTS_FIVE_OF_A_KIND;
      }
      if (amountOfJoker === 0) {
        // Four of a kind
        points += POINTS_FOUR_OF_A_KIND;
      }
    }
    if (maxEqual === 3) {
      if (amountOfJoker === 2) {
        // Five of a kind
        points += POINTS_FIVE_OF_A_KIND;
      }
      if (amountOfJoker === 1) {
        // Four of a kind
        points += POINTS_FOUR_OF_A_KIND;
      }
      if (amountOfJoker === 0) {
        if (otherMaxEqual === 2) {
          // Full house
          points += POINTS_FULL_HOUSE;
        }
        if (otherMaxEqual === 1) {
          // Three of a kind
          points += POINTS_THREE_OF_A_KIND;
        }
      }
    }
    if (maxEqual === 2) {
      if (amountOfJoker === 3) {
        // Five of a kind
        points += POINTS_FIVE_OF_A_KIND;
      }
      if (amountOfJoker === 2) {
        // Four of a kind
        points += POINTS_FOUR_OF_A_KIND;
      }
      if (amountOfJoker === 1) {
        if (otherMaxEqual === 2) {
          // Full house
          points += POINTS_FULL_HOUSE;
        }
        if (otherMaxEqual === 1) {
          // Three of a kind
          points += POINTS_THREE_OF_A_KIND;
        }
      }
      if (amountOfJoker === 0) {
        if (otherMaxEqual === 2) {
          // Two pair
          points += POINTS_TWO_PAIR;
        }
        if (otherMaxEqual === 1) {
          // One pair
          points += POINTS_ONE_PAIR;
        }
      }
    }
    if (maxEqual === 1) {
      if (amountOfJoker === 4) {
        // Five of a kind
        points += POINTS_FIVE_OF_A_KIND;
      }
      if (amountOfJoker === 3) {
        // Four of a kind
        points += POINTS_FOUR_OF_A_KIND;
      }
      if (amountOfJoker === 2) {
        // Three of a kind
        points += POINTS_THREE_OF_A_KIND;
      }
      if (amountOfJoker === 1) {
        // One pair
        points += POINTS_ONE_PAIR;
      }
      if (amountOfJoker === 0) {
        // Hogh card
        points += POINTS_HIGH_CARD;
      }
    }

    handPoints.push({
      typePoints: points,
      cardPoints: [...hand].map((card) => PART_2_POINTS_CARD_MAP[card]),
      bid: bid,
    });
  }

  handPoints.sort((a, b) => {
    const compType = a.typePoints - b.typePoints;
    if (compType === 0) {
      for (let index = 0; index < a.cardPoints.length; index++) {
        const compCard = a.cardPoints[index] - b.cardPoints[index];
        if (compCard === 0) {
          continue;
        }
        return compCard;
      }
      return 0;
    }
    return compType;
  });

  let total = 0;
  for (let index = 0; index < handPoints.length; index++) {
    const points = handPoints[index];
    const bid = points.bid;

    total += bid * (index + 1);
  }

  return total;
}

function amountOfOcurrences(data: string, char: string): number {
  const re = new RegExp(char, 'g');
  return (data.match(re) || []).length;
}
