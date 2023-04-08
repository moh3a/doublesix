import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../config/firebase.config";
import {
  ActionStore,
  GameStore,
  HandStore,
  IGame,
  IHand,
  IRound,
  MessageStore,
  PlayersStore,
  PlayersTurn,
  RoundStore,
} from "../types";

export const useAction = create<ActionStore>()(
  persist(
    (set, get) => ({
      resetActions() {
        set({ actions: [], prompt: "" });
      },
      setAction(prompt, actions) {
        set({ prompt, actions });
      },
    }),
    { name: "action", storage: createJSONStorage(() => AsyncStorage) }
  )
);

export const useMessage = create<MessageStore>()(
  persist(
    (set, get) => ({
      setMessage({ type, text }) {
        set({ type, text });
      },
      setTimedMessage({ type, text, duration }) {
        set({ type, text });
        setTimeout(() => {
          set({ type: undefined, text: undefined });
        }, duration);
      },
      resetMessage() {
        set({ type: undefined, text: undefined });
      },
    }),
    { name: "message", storage: createJSONStorage(() => AsyncStorage) }
  )
);

const INITIAL_GAME: IGame = {
  admin: "",
  createdAt: "",
  id: "",
  players: [],
  rounds: [],
  lastRoundWinner: "",
  teamOnePlayers: [],
  teamTwoPlayers: [],
  status: "IDLE",
  token: "",
  type: "PUBLIC",
};

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_GAME,
      setId(id) {
        set({ id });
      },
      updateGame(doc) {
        set({ ...doc });
      },
      resetGame() {
        set(INITIAL_GAME);
      },
    }),
    { name: "game", storage: createJSONStorage(() => AsyncStorage) }
  )
);

const INITIAL_ROUND: IRound = {
  gameId: "",
  id: "",
  turn: "",
  board: [],
  passCount: 0,
  startingPlayer: "",
  pointsWon: 0,
  startingDomino: "",
  winner: "",
};

export const useRound = create<RoundStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_ROUND,
      setRoundId(id) {
        set({ id });
      },
      updateRound(doc) {
        set({ ...doc });
      },
      resetRound() {
        set(INITIAL_ROUND);
      },
    }),
    { name: "round", storage: createJSONStorage(() => AsyncStorage) }
  )
);

const INITIAL_HAND: IHand = {
  gameId: "",
  hand: [],
  playerId: "",
  roundId: "",
};

export const useHand = create<HandStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_HAND,
      updateHand(doc) {
        set({ ...doc });
      },
      resetHand() {
        set(INITIAL_HAND);
      },
    }),
    { name: "hand", storage: createJSONStorage(() => AsyncStorage) }
  )
);

const INITIAL_PLAYERS: { players: PlayersTurn[] } = {
  players: [],
};

export const usePlayers = create<PlayersStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_PLAYERS,
      async getPlayers(players) {
        for await (let player of players) {
          if (player.id && !player.name) {
            const userRef = doc(db, "users", player.id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              player.name = userSnap.data().name;
              player.photoURL = userSnap.data().photoURL;
            }
          }
        }
        set({ players });
      },
      updatePlayers(docs) {
        const newplayers = [];
        docs.forEach((p) => {
          const pl = get().players.find((e) => e.id === p);
          newplayers.push(pl);
        });
        set({ players: newplayers });
      },
      resetPlayers() {
        set(INITIAL_PLAYERS);
      },
    }),
    { name: "players", storage: createJSONStorage(() => AsyncStorage) }
  )
);

interface BoardPromptStore {
  domino?: string;
  setBoardPrompt: (domino: string) => void;
  resetBoardPrompt: () => void;
}

export const useBoardPrompt = create<BoardPromptStore>((set, get) => ({
  domino: "",
  setBoardPrompt(domino: string) {
    set({ domino });
  },
  resetBoardPrompt() {
    set({ domino: "" });
  },
}));
