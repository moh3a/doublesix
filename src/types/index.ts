/**
 * DOMINO RELATED TYPES
 */
export interface IDomino {
  x: number;
  y: number;
}

export interface IDominoBlock extends IDomino {
  id: string;
  coordinates: { cx: string; cy: string }[];
}

export interface DominoProps {
  top: number;
  bottom: number;
  rotation?: number;
  height?: number;
  width?: number;
  backgroundColor?: string;
  color?: string;
  blank?: boolean;
}

/**
 * GAME RELATED TYPES
 */
export type GameStatus = "IDLE" | "PLAYING" | "FINISHED";
export type GameType = "PUBLIC" | "PRIVATE";
export type RoundStatus = "PLAYING" | "ENDED" | "BLOCKED";

export interface IGame {
  id?: string;
  status: GameStatus;
  type: GameType;
  admin?: string;
  token?: string;
  players?: string[];
  teamOnePlayers?: string[];
  teamOneScore?: number;
  teamTwoPlayers?: string[];
  teamTwoScore?: number;
  rounds?: string[];
  score?: (1 | 2)[];
  lastRoundWinner?: string;
  createdAt?: any;
}

export interface IRound {
  id?: string;
  gameId: string;
  board: string[];
  passCount?: number;
  turn?: string;
  status?: RoundStatus;
  startingPlayer?: string;
  startingDomino?: string;
  winner?: string;
  winningTeam?: 1 | 2;
  pointsWon?: number;
}

export interface IHand {
  gameId: string;
  roundId: string;
  playerId: string;
  hand: string[];
}

/**
 * COMPONENT PROPS
 */
export type NavigationType<T extends keyof RootTabParamList> =
  RootTabScreenProps<T>["navigation"];

export interface JoinComponentProps {
  navigation: NavigationType<"Join">;
}

export interface LobbyComponentProps {
  navigation: NavigationType<"Server">;
}

export interface TeamCardComponentProps {
  id: 1 | 2;
  score: number;
}

export interface RoundComponentProps {
  navigation: NavigationType<"Room">;
}

export interface LoginComponentProps {
  action: AuthActionType;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * HELPER TYPES
 */
export interface ResetStore {
  resetGame: () => void;
  resetRound: () => void;
  resetPlayers: () => void;
  resetHand: () => void;
  resetActions?: () => void;
}

export type SetActionType = (
  prompt: string,
  actions: { title: string; handler: () => void }[]
) => void;

export type MessageType = "error" | "warning" | "success";

export interface SetMessageParams {
  type: MessageType;
  text: string;
  duration: number;
}

export type SetMessageType = (
  params: Omit<SetMessageParams, "duration">
) => void;
export type SetTimedMessageType = (params: SetMessageParams) => void;

export type SetIdType = (id: string) => void;

export interface PlayersTurn {
  id: string;
  name?: string;
  team?: 1 | 2;
  photoURL?: string;
}

export interface CheckIsPlayableReturnType {
  isPlayable: boolean;
  addTo: "front" | "back";
  swap: boolean;
}

/**
 * STORE TYPES
 */
export interface ActionStore {
  prompt?: string;
  actions?: { title: string; handler: () => void }[];
  setAction: SetActionType;
  resetActions: ResetStore["resetActions"];
}

export interface MessageStore {
  type?: MessageType;
  text?: string;
  setTimedMessage: SetTimedMessageType;
  setMessage: SetMessageType;
  resetMessage: () => void;
}

export interface GameStore extends IGame {
  setId: SetIdType;
  updateGame: (doc: IGame) => void;
  resetGame: ResetStore["resetGame"];
}

export interface RoundStore extends IRound {
  setRoundId: SetIdType;
  updateRound: (doc: IRound) => void;
  resetRound: ResetStore["resetRound"];
}

export interface HandStore extends IHand {
  updateHand: (doc: IHand) => void;
  resetHand: ResetStore["resetHand"];
}

export interface PlayersStore {
  players: PlayersTurn[];
  getPlayers: (data: PlayersTurn[]) => void;
  updatePlayers: (data: string[]) => void;
  resetPlayers: ResetStore["resetHand"];
}

/**
 * AUTH HANDLERS
 */
import { Dispatch, SetStateAction } from "react";

export type AuthActionType = "CREATE" | "LOGIN" | "LINK";

export interface SignInHandlerParams {
  email: string;
  password: string;
  username: string;
  action: AuthActionType;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTimedMessage: SetTimedMessageType;
}

export interface SignOutHandlerParams extends ResetStore {
  navigation: NavigationType<"Account">;
}

export interface DeleteAccountHandlerParams extends SignOutHandlerParams {
  setTimedMessage: SetTimedMessageType;
}

/**
 * HANDLERS
 */
export interface CheckPastGamesHandlerParams extends ResetStore {
  action: "CREATE" | "JOIN";
  navigation: NavigationType<"Home">;
  setId: GameStore["setId"];
  setRoundId: RoundStore["setRoundId"];
  setAction: ActionStore["setAction"];
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export interface CreateGameHandlerParams extends ResetStore {
  type: GameType;
  navigation: NavigationType<"Home">;
  setId: GameStore["setId"];
  setTimedMessage: MessageStore["setTimedMessage"];
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export interface JoinGameHandlerParams {
  token: GameStore["token"];
  setId: GameStore["setId"];
  setTimedMessage: MessageStore["setTimedMessage"];
  navigation: NavigationType<"Join">;
}

export interface ChooseTeammateHandlerParams {
  gameId: GameStore["id"];
  playerId: GameStore["players"][0];
  admin: GameStore["admin"];
  setTimedMessage: SetTimedMessageType;
}

export interface RemovePlayerHandlerParams extends ChooseTeammateHandlerParams {
  navigation: NavigationType<"Server">;
}

export interface ExitGameHandlerParams extends ResetStore {
  gameId: GameStore["id"];
  setAction: ActionStore["setAction"];
  setTimedMessage: MessageStore["setTimedMessage"];
  navigation: NavigationType<"Room" | "Server">;
}

export interface CancelGameHandlerParams extends ResetStore {
  gameId: GameStore["id"];
  admin: GameStore["admin"];
  navigation: NavigationType<"Room" | "Server">;
}

export interface StartGameHandlerParams extends CreateNewRoundHandlerParams {
  admin: GameStore["admin"];
  players: PlayersStore["players"];
  teamOnePlayers: GameStore["teamOnePlayers"];
  teamTwoPlayers: GameStore["teamTwoPlayers"];
}

export interface CreateNewRoundHandlerParams {
  gameId: GameStore["id"];
  roundId: RoundStore["id"];
  setRoundId: RoundStore["setRoundId"];
  resetRound: RoundStore["resetRound"];
  resetHand: HandStore["resetHand"];
  setTimedMessage: MessageStore["setTimedMessage"];
  navigation: NavigationType<"Room" | "Server">;
}

export interface PlayHandHandlerParams {
  domino: HandStore["hand"][0];
  gameId: GameStore["id"];
  roundId: RoundStore["id"];
  players: PlayersStore["players"];
  setTimedMessage: MessageStore["setTimedMessage"];
  checkIsPlayable?: (domino: string) => CheckIsPlayableReturnType;
  isPlayable?: CheckIsPlayableReturnType;
}

export interface PassToNextPlayerHandlerParams {
  roundId: RoundStore["id"];
  players: PlayersStore["players"];
  setTimedMessage: MessageStore["setTimedMessage"];
}

export interface GamesOnSnapshotHandlerParams extends ResetStore {
  data: IGame;
  setAction: ActionStore["setAction"];
  setRoundId: RoundStore["setRoundId"];
  setTimedMessage: MessageStore["setTimedMessage"];
  getPlayers: PlayersStore["getPlayers"];
  updatePlayers: PlayersStore["updatePlayers"];
  updateGame: GameStore["updateGame"];
  navigation: NavigationType<"Room" | "Server">;
}

export interface RoundsOnSnapshotHandlerParams {
  data: IRound;
  gameId: GameStore["id"];
  rounds: GameStore["rounds"];
  teamOnePlayers: GameStore["teamOnePlayers"];
  teamTwoPlayers: GameStore["teamTwoPlayers"];
  playerId: HandStore["playerId"];
  hand: HandStore["hand"];
  players: PlayersStore["players"];
  roundId: RoundStore["id"];
  status: RoundStore["status"];
  updateRound: RoundStore["updateRound"];
}

/**
 * GLOBAL REACT NATIVE NAVIGATION TYPES
 */
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Server: {
    gameId: string;
  };
  Join: undefined;
  Room: {
    gameId: string;
    roundId: string;
  };
  Account: undefined;
  Info: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
