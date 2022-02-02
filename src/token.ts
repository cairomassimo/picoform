// Inspired by https://metacpan.org/dist/Noid/view/noid#NOID-CHECK-DIGIT-ALGORITHM

export const alphabetString = "bcdfghjkmnpqrstvwxz";
export const alphabet = Array.from(alphabetString);
const size = 19; // Prime
if (alphabet.length !== size) throw new Error(`alphabet size mismatch`);

const valueMap: Record<string, number> = Object.fromEntries(alphabet.map((x, i) => [x, i]));

const digitPatternString = `[${alphabetString}${alphabetString.toUpperCase()}]`;

export const partDefinitions = [
  { start: 0, length: 3, end: 3 },
  { start: 4, length: 4, end: 8 },
  { start: 9, length: 3, end: 12 },
];

export const dashesIndexes = [3, 8];

export const patternString = `^${partDefinitions.map((x) => `${digitPatternString}{${x.length}}`).join("-")}$`;

export function computeCheckDigit(characters: string[]) {
  return alphabet.at(characters.reduce((acc, x, i) => (acc + valueMap[x] * (i + 1)) % size, 0));
}
