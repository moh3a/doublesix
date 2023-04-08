import Dominoes from "../constants/Dominoes";

export const generateToken = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex: number;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const arrayRotate = <T>(arr: T[], count: number): T[] => {
  const len = arr.length;
  arr.push(...arr.splice(0, ((-count % len) + len) % len));
  return arr;
};

export const generateShuffledHands = () => {
  const dominoes = shuffle(Dominoes);
  let dIndex = dominoes.findIndex((d) => d.id === "66");
  const hands: string[][] = [
    dominoes.slice(0, Math.floor(dominoes.length / 4)).map((e) => e.id),
    dominoes
      .slice(Math.floor(dominoes.length / 4), Math.floor(dominoes.length / 2))
      .map((e) => e.id),
    dominoes
      .slice(
        Math.floor(dominoes.length / 2),
        Math.floor((dominoes.length * 3) / 4)
      )
      .map((e) => e.id),
    dominoes.slice(Math.floor((dominoes.length * 3) / 4)).map((e) => e.id),
  ];
  if (dIndex < Math.floor(dominoes.length / 4)) {
    dIndex = 0;
  } else if (
    dIndex >= Math.floor(dominoes.length / 4) &&
    dIndex < Math.floor(dominoes.length / 2)
  ) {
    dIndex = 1;
  } else if (
    dIndex >= Math.floor(dominoes.length / 2) &&
    dIndex < Math.floor((dominoes.length * 3) / 4)
  ) {
    dIndex = 2;
  } else {
    dIndex = 3;
  }
  return { hands, index: dIndex };
};

export const checkIsDominoPlayable = (
  domino: string,
  status: "PLAYING" | "ENDED" | "BLOCKED",
  turn: string,
  playerId: string,
  board: string[],
  rounds: string[]
): boolean => {
  let dA = parseInt(domino.substring(0, 1));
  let dB = parseInt(domino.substring(1));
  if (board && rounds && status === "PLAYING" && playerId === turn) {
    if (board.length === 0) {
      if (rounds.length > 1 || (rounds.length === 1 && dA === 6 && dB === 6))
        return true;
      else return false;
    } else if (board.length > 0) {
      let frontValue = parseInt(board[0].substring(0, 1));
      let backValue = parseInt(board[board.length - 1].substring(1));
      if (dA === frontValue) return true;
      else if (dB === frontValue) return true;
      else if (dA === backValue) return true;
      else if (dB === backValue) return true;
      else return false;
    }
  } else return false;
};

export const togglePlayerSpeaker = async () => {
  console.log("todo: toggle player mute/unmute");
};
