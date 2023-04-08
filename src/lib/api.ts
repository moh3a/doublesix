import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  updateDoc,
  arrayUnion,
  getDoc,
  addDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  increment,
} from "firebase/firestore";

import { db } from "../config/firebase.config";
import { arrayRotate, generateShuffledHands, generateToken } from "./helpers";
import { IGame, IRound } from "../types";

export const createGame = async (
  playerId: string,
  type: "PUBLIC" | "PRIVATE"
) => {
  const token = generateToken(6);
  const input: IGame = {
    status: "IDLE",
    admin: playerId,
    type,
    players: [playerId],
    rounds: [],
    score: [],
    createdAt: serverTimestamp(),
  };
  if (type === "PRIVATE") input.token = token;
  const gameRef = await addDoc(collection(db, "games"), input);
  const { success } = await createTeams(gameRef.id, playerId);
  if (success) {
    await updateDoc(doc(db, "users", playerId), {
      gameId: gameRef.id,
    });
    return {
      success: true,
      id: gameRef.id,
      message: "Successfully created a game.",
    };
  } else return { success: false, message: "Could not set teams!" };
};

export const checkPastGames = async (playerId: string) => {
  const userSnapshot = await getDoc(doc(db, "users", playerId));
  if (userSnapshot.exists() && userSnapshot.data().gameId) {
    const gameSnapshot = await getDoc(
      doc(db, "games", userSnapshot.data().gameId)
    );
    if (gameSnapshot.exists()) {
      return {
        exists: true,
        doc: {
          ...gameSnapshot.data(),
          id: gameSnapshot.id,
        } as IGame,
      };
    } else return { exists: false };
  } else return { exists: false };
};

export const cleanData = async (
  fbc: "rounds" | "hands",
  field: string,
  value: string
) => {
  const docsQuery = query(collection(db, fbc), where(field, "==", value));
  const docsSnap = await getDocs(docsQuery);
  for await (let document of docsSnap.docs) {
    await updateDoc(doc(db, "users", document.id), {
      gameId: "",
    });
    await deleteDoc(doc(db, fbc, document.id));
  }
};

export const cancelGame = async (gameId: string) => {
  const collections: ["rounds", "hands"] = ["rounds", "hands"];
  for await (let c of collections) {
    await cleanData(c, "gameId", gameId);
  }
  await deleteDoc(doc(db, "games", gameId));
};

export const createTeams = async (gameId: string, playerId: string) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    teamOnePlayers: [playerId],
    teamOneScore: 0,
    teamTwoPlayers: [],
    teamTwoScore: 0,
  } as Partial<IGame>);
  return { success: true };
};

export const joinGame = async (token: string, playerId: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, "games"), where("token", "==", token))
  );
  if (!querySnapshot.empty && querySnapshot.size === 1) {
    let id = "";
    let gameData: any = undefined;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.players && data.players.length < 4 && data.status === "IDLE") {
        id = doc.id;
        gameData = data;
      }
    });
    if (id) {
      const docRef = doc(db, "games", id);
      let data: any = {
        players: arrayUnion(playerId),
      };
      if (gameData.teamOnePlayers.length === 2)
        data.teamTwoPlayers = arrayUnion(playerId);
      await updateDoc(docRef, data);
      await updateDoc(doc(db, "users", playerId), {
        gameId: id,
      });
      return { success: true, id, message: "Successfully joined the game." };
    } else return { success: false, message: "Game not found." };
  } else return { success: false, message: "Invalid token!" };
};

export const joinPublicGame = async (playerId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "games"),
      where("type", "==", "PUBLIC"),
      orderBy("createdAt")
    )
  );
  if (!querySnapshot.empty) {
    let id = "";
    for await (let game of querySnapshot.docs) {
      if (
        game.exists() &&
        game.data().players &&
        game.data().players.length < 4 &&
        game.data().status === "IDLE"
      ) {
        id = game.id;
        const docRef = doc(db, "games", game.id);
        let data: any = {
          players: arrayUnion(playerId),
        };
        if (game.data().teamOnePlayers.length === 2)
          data.teamTwoPlayers = arrayUnion(playerId);
        await updateDoc(docRef, data);
        await updateDoc(doc(db, "users", playerId), {
          gameId: id,
        });
        break;
      }
    }
    if (id)
      return {
        success: true,
        id,
        message: "Successfully joined the game.",
      };
    else return { success: false, message: "No games available!" };
  } else return { success: false, message: "No games available!" };
};

export const removePlayer = async (gameId: string, playerId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnapshot = await getDoc(gameRef);
  if (gameSnapshot.exists()) {
    const data = gameSnapshot.data();
    await updateDoc(gameRef, {
      players: data.players.filter((p: string) => p !== playerId),
    });
    await updateDoc(doc(db, "users", playerId), {
      gameId: "",
    });
    return { success: true, message: "Successfully removed player." };
  } else return { success: false, message: "Game not found!" };
};

export const chooseTeammate = async (gameId: string, playerId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnapshot = await getDoc(gameRef);
  if (gameSnapshot.exists()) {
    const data = gameSnapshot.data();
    if (data.players && data.players.length > 1) {
      const index = data.players.find((p: string) => p === playerId);
      if (index !== -1) {
        await updateDoc(gameRef, {
          teamOnePlayers: arrayUnion(playerId),
          teamTwoPlayers: data.players.filter(
            (p: string) => p !== playerId && p !== data.admin
          ),
        });
        return {
          success: true,
          message: "Your teammate was successfully set.",
        };
      } else return { success: false, message: "Player not in game!" };
    } else return { success: false, message: "You are alone!" };
  } else return { success: false, message: "Game not found!" };
};

export const startGame = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnapshot = await getDoc(gameRef);
  if (gameSnapshot.exists()) {
    const data = gameSnapshot.data();
    if (data.players && data.players.length === 4) {
      await updateDoc(gameRef, {
        status: "PLAYING",
      });
      return { success: true, message: "Game started!" };
    } else
      return { success: false, message: "There must be 4 players to start." };
  } else return { success: false, message: "Game not found!" };
};

export const createRound = async (gameId: string) => {
  const dominoes = generateShuffledHands();
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists()) {
    const data = gameSnap.data();
    let parsedPlayers = [
      data.teamOnePlayers[0],
      data.teamTwoPlayers[0],
      data.teamOnePlayers[1],
      data.teamTwoPlayers[1],
    ];
    if (data.players && data.players.length === 4) {
      const roundRef = await addDoc(collection(db, "rounds"), {
        gameId: gameSnap.id,
        board: [],
        startingPlayer:
          data.rounds.length === 0
            ? parsedPlayers[dominoes.index]
            : data.lastRoundWinner,
        status: "PLAYING",
        turn:
          data.rounds.length === 0
            ? parsedPlayers[dominoes.index]
            : data.lastRoundWinner,
      });
      for await (let index of [0, 1, 2, 3]) {
        await setDoc(doc(db, "hands", parsedPlayers[index]), {
          gameId: gameSnap.id,
          roundId: roundRef.id,
          playerId: parsedPlayers[index],
          hand: dominoes.hands[index],
        });
      }
      await updateDoc(gameRef, {
        players: arrayRotate(parsedPlayers, dominoes.index),
        rounds: arrayUnion(roundRef.id),
      });
      return {
        success: true,
        message: "Successfull round setup.",
        id: roundRef.id,
      };
    } else
      return { success: false, message: "There must be 4 players to start." };
  } else return { success: false, message: "Game not found!" };
};

export const playHand = async (
  playerId: string,
  gameId: string,
  roundId: string,
  dominoId: string,
  domino: string,
  addTo: "front" | "back",
  nextPlayer: string
) => {
  const roundRef = doc(db, "rounds", roundId);
  const roundSnap = await getDoc(roundRef);
  if (roundSnap.exists()) {
    const isFirstHand = roundSnap.data().board.length === 0;
    if (roundSnap.data().turn === playerId) {
      const handRef = doc(db, "hands", playerId);
      const handSnap = await getDoc(handRef);
      if (handSnap.exists()) {
        const new_hand = handSnap
          .data()
          .hand.filter((h: string) => h !== dominoId);
        await updateDoc(handRef, {
          hand: new_hand,
        });
        const newboard =
          addTo === "front"
            ? [domino, ...roundSnap.data().board]
            : [...roundSnap.data().board, domino];
        let data: Partial<IRound> = {
          board: newboard,
        };
        if (isFirstHand) data.startingDomino = domino;
        await updateDoc(roundRef, data);
        if (new_hand.length === 0) {
          const { message, success } = await roundEnded(
            gameId,
            roundId,
            playerId
          );
          return { success, message };
        } else {
          await passToNextPlayer(roundId, nextPlayer, true);
          return { success: true, message: "Successfully played your hand." };
        }
      } else return { success: false, message: "Player does not exist" };
    } else return { success: false, message: "Not your turn." };
  } else return { success: false, message: "Round not found!" };
};

export const passToNextPlayer = async (
  roundId: string,
  nextPlayer: string,
  played: boolean
) => {
  const roundRef = doc(db, "rounds", roundId);
  const roundSnap = await getDoc(roundRef);
  if (roundSnap.exists()) {
    await updateDoc(roundRef, {
      turn: nextPlayer,
      passCount: played ? 0 : increment(1),
    });
    return {
      success: true,
      message: "Successfully passed to the next player.",
    };
  } else return { success: false, message: "Round not found." };
};

export const roundEnded = async (
  gameId: string,
  roundId: string,
  playerId: string
) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  const handRef = doc(db, "hands", playerId);
  const handSnap = await getDoc(handRef);
  if (
    handSnap.exists() &&
    handSnap.data().hand.length === 0 &&
    gameSnap.exists()
  ) {
    let gainedTeamOneScore = 0;
    let gainedTeamTwoScore = 0;
    const gameData = gameSnap.data() as Omit<IGame, "id">;
    const isPlayerTeamOne = gameData.teamOnePlayers.findIndex(
      (p) => p === playerId
    );
    if (isPlayerTeamOne !== -1) {
      for await (let player of gameData.teamTwoPlayers) {
        const playerSnap = await getDoc(doc(db, "hands", player));
        if (playerSnap.exists()) {
          playerSnap.data().hand.forEach((domino: string) => {
            gainedTeamOneScore +=
              parseInt(domino.substring(0, 1)) + parseInt(domino.substring(1));
          });
        }
      }
    } else {
      for await (let player of gameData.teamOnePlayers) {
        const playerSnap = await getDoc(doc(db, "hands", player));
        if (playerSnap.exists()) {
          playerSnap.data().hand.forEach((domino: string) => {
            gainedTeamTwoScore +=
              parseInt(domino.substring(0, 1)) + parseInt(domino.substring(1));
          });
        }
      }
    }
    await updateDoc(gameRef, {
      teamOneScore: increment(gainedTeamOneScore),
      teamTwoScore: increment(gainedTeamTwoScore),
      score: arrayUnion(isPlayerTeamOne !== -1 ? 1 : 2),
      lastRoundWinner: playerId,
    });
    await updateDoc(doc(db, "rounds", roundId), {
      status: "ENDED",
      winner: playerId,
      winningTeam: isPlayerTeamOne !== -1 ? 1 : 2,
      pointsWon:
        isPlayerTeamOne !== -1 ? gainedTeamOneScore : gainedTeamTwoScore,
    });
    await gameEndedCheck(gameId);
    return { success: true, message: "Round ended, back to the lobby." };
  } else return { success: false, message: "Error with the player ID" };
};

export const roundBlocked = async (
  gameId: string,
  roundId: string,
  teamOnePlayers: string[],
  teamTwoPlayers: string[]
) => {
  const handsSnapshot = await getDocs(
    query(collection(db, "hands"), where("roundId", "==", roundId))
  );
  if (!handsSnapshot.empty && handsSnapshot.size === 4) {
    let smallestHand = 100;
    let smallestHandPlayer = "";
    let teamOneScore = 0;
    let teamTwoScore = 0;
    const teamHandCount = (player: string, team: 1 | 2) => {
      const index = handsSnapshot.docs.findIndex((doc) => doc.id === player);
      if (index !== -1) {
        let handCount = 0;
        handsSnapshot.docs[index].data().hand.forEach((domino: string) => {
          handCount +=
            parseInt(domino.substring(0, 1)) + parseInt(domino.substring(1));
        });
        if (handCount < smallestHand) {
          smallestHand = handCount;
          smallestHandPlayer = player;
        }
        if (team === 1) teamOneScore += handCount;
        else if (team === 2) teamTwoScore += handCount;
      }
    };
    teamOnePlayers.forEach((player) => teamHandCount(player, 1));
    teamTwoPlayers.forEach((player) => teamHandCount(player, 2));
    const winningTeam = teamTwoScore > teamOneScore ? 1 : 2;
    await updateDoc(doc(db, "games", gameId), {
      teamOneScore: increment(teamTwoScore > teamOneScore ? teamTwoScore : 0),
      teamTwoScore: increment(teamOneScore > teamTwoScore ? teamOneScore : 0),
      score: arrayUnion(winningTeam),
      lastRoundWinner: smallestHandPlayer,
    });
    await updateDoc(doc(db, "rounds", roundId), {
      status: "BLOCKED",
      winner: smallestHandPlayer,
      winningTeam,
      pointsWon: teamTwoScore > teamOneScore ? teamTwoScore : teamOneScore,
    });
    await gameEndedCheck(gameId);
    return { success: true, message: "Round blocked, back to the lobby." };
  } else return { success: false, message: "Error with the round ID." };
};

export const gameEndedCheck = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists()) {
    if (
      gameSnap.data().teamOneScore >= 100 ||
      gameSnap.data().teamTwoScore >= 100
    ) {
      let winningTeam =
        gameSnap.data().teamOneScore > gameSnap.data().teamTwoScore ? 1 : 2;
      await updateDoc(gameRef, {
        status: "FINISHED",
        winningTeam,
        winners:
          winningTeam === 1
            ? gameSnap.data().teamOnePlayers
            : gameSnap.data().teamTwoPlayers,
      });
      return true;
    } else return false;
  } else return false;
};

export const shiftBoard = async (
  roundId: string,
  board: string[],
  startingDomino: string
) => {
  const roundRef = doc(db, "rounds", roundId);
  const index = board.findIndex((e) => e === startingDomino);
  if (index > 13) {
    await updateDoc(roundRef, {
      startingDomino: board[index - 1],
    });
  } else if (board.length - index > 13) {
    await updateDoc(roundRef, {
      startingDomino: board[index + 1],
    });
  }
};
