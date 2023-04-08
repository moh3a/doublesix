import { auth } from "../config/firebase.config";
import {
  cancelGame,
  checkPastGames,
  chooseTeammate,
  createGame,
  createRound,
  joinGame,
  joinPublicGame,
  passToNextPlayer,
  playHand,
  removePlayer,
  roundBlocked,
  shiftBoard,
  startGame,
} from "../lib/api";
import { checkIsDominoPlayable } from "../lib/helpers";
import {
  CancelGameHandlerParams,
  CheckIsPlayableReturnType,
  CheckPastGamesHandlerParams,
  ChooseTeammateHandlerParams,
  CreateGameHandlerParams,
  CreateNewRoundHandlerParams,
  ExitGameHandlerParams,
  GamesOnSnapshotHandlerParams,
  JoinGameHandlerParams,
  PassToNextPlayerHandlerParams,
  PlayHandHandlerParams,
  PlayersTurn,
  RemovePlayerHandlerParams,
  RoundsOnSnapshotHandlerParams,
  StartGameHandlerParams,
} from "../types";
import { anonymousSignInHandler } from "./handlers.auth";

export const checkPastGamesHandler = async (
  params: CheckPastGamesHandlerParams
) => {
  if (!auth.currentUser) {
    await anonymousSignInHandler();
  }
  const { exists, doc } = await checkPastGames(auth.currentUser.uid);
  if (exists && doc) {
    params.setAction("You have already joined a game. Do you wish to...", [
      {
        title: "Continue game",
        handler: () => {
          if (doc.status === "PLAYING") {
            params.setId(doc.id);
            params.setRoundId(doc.rounds[doc.rounds.length - 1]);
            params.navigation.navigate("Room");
          } else if (doc.status === "IDLE") {
            params.setId(doc.id);
            params.navigation.navigate("Server");
          }
          params.resetActions();
        },
      },
      {
        title: "Cancel",
        handler: async () => {
          const { success } = await removePlayer(doc.id, auth.currentUser.uid);
          if (success) {
            params.resetPlayers();
            params.resetGame();
            params.resetRound();
            params.resetHand();
            if (params.action === "JOIN") {
              params.navigation.navigate("Join");
            } else if (params.action === "CREATE") {
              params.setOpenModal(true);
            }
          }
          params.resetActions();
        },
      },
    ]);
  } else {
    if (params.action === "JOIN") {
      params.navigation.navigate("Join");
    } else if (params.action === "CREATE") {
      params.setOpenModal(true);
    }
  }
};

export const createGameHandler = async (params: CreateGameHandlerParams) => {
  if (auth.currentUser && params.type) {
    params.resetGame();
    params.resetRound();
    params.resetPlayers();
    params.resetHand();
    const {
      id: gameId,
      message: text,
      success,
    } = await createGame(auth.currentUser.uid, params.type);
    if (success && gameId) {
      params.setTimedMessage({ type: "success", text, duration: 2000 });
      params.setId(gameId);
      params.navigation.navigate("Server");
    } else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
  params.setOpenModal(false);
};

export const joinGameHandler = async (params: JoinGameHandlerParams) => {
  if (auth.currentUser && params.token) {
    let {
      id,
      message: text,
      success,
    } = await joinGame(params.token, auth.currentUser.uid);
    if (id && success) {
      params.setTimedMessage({ type: "success", text, duration: 2000 });
      params.setId(id);
      params.navigation.navigate("Server", { gameId: id });
    } else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const joinPublicGameHandler = async (
  params: Omit<JoinGameHandlerParams, "token">
) => {
  if (auth.currentUser) {
    let {
      id,
      message: text,
      success,
    } = await joinPublicGame(auth.currentUser.uid);
    if (id && success) {
      params.setTimedMessage({ type: "success", text, duration: 2000 });
      params.setId(id);
      params.navigation.navigate("Server", { gameId: id });
    } else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const chooseTeammateHandler = async (
  params: ChooseTeammateHandlerParams
) => {
  if (
    params.gameId &&
    auth.currentUser &&
    auth.currentUser.uid === params.admin
  ) {
    const { success, message: text } = await chooseTeammate(
      params.gameId,
      params.playerId
    );
    if (success)
      params.setTimedMessage({ type: "success", text, duration: 2000 });
    else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const removePlayerHandler = async (
  params: RemovePlayerHandlerParams
) => {
  if (
    params.gameId &&
    auth.currentUser &&
    auth.currentUser.uid === params.admin
  ) {
    const { message: text, success } = await removePlayer(
      params.gameId,
      params.playerId
    );
    if (success) {
      params.setTimedMessage({ type: "success", text, duration: 2000 });
      params.navigation.navigate("Home");
    } else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const exitGameHandler = (params: ExitGameHandlerParams) => {
  params.setAction("Are you sure you want to exit the game?", [
    {
      title: "Exit game",
      async handler() {
        if (params.gameId && auth.currentUser) {
          const { message: text, success } = await removePlayer(
            params.gameId,
            auth.currentUser.uid
          );
          if (success) {
            params.setTimedMessage({ type: "success", text, duration: 3000 });
            params.resetGame();
            params.resetRound();
            params.resetPlayers();
            params.resetHand();
          } else
            params.setTimedMessage({ type: "error", text, duration: 3000 });
        } else
          params.setTimedMessage({
            type: "error",
            text: "Problem getting game credentials.",
            duration: 3000,
          });
        params.navigation.navigate("Home");
        params.resetActions();
      },
    },
    {
      title: "Continue game",
      handler() {
        params.resetActions();
      },
    },
  ]);
};

export const cancelGameHandler = async (params: CancelGameHandlerParams) => {
  if (
    params.gameId &&
    auth.currentUser &&
    auth.currentUser.uid === params.admin
  ) {
    await cancelGame(params.gameId);
    params.resetGame();
    params.resetRound();
    params.resetPlayers();
    params.resetHand();
    params.navigation.navigate("Home");
  }
};

export const startGameHandler = async (params: StartGameHandlerParams) => {
  if (
    params.gameId &&
    auth.currentUser &&
    auth.currentUser.uid === params.admin &&
    params.players &&
    params.players.length === 4 &&
    params.teamOnePlayers &&
    params.teamOnePlayers.length === 2 &&
    params.teamTwoPlayers &&
    params.teamTwoPlayers.length === 2
  ) {
    const { message: text, success } = await startGame(params.gameId);
    if (success) {
      params.setTimedMessage({ type: "success", text, duration: 2000 });
      await createNewRoundHandler(params);
    } else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const createNewRoundHandler = async (
  params: CreateNewRoundHandlerParams
) => {
  params.resetRound();
  params.resetHand();
  const { message: text, success, id } = await createRound(params.gameId);
  if (success) {
    params.setRoundId(id);
    params.navigation.navigate("Room", {
      gameId: params.gameId,
      roundId: params.roundId,
    });
    params.setTimedMessage({ type: "success", text, duration: 2000 });
  } else params.setTimedMessage({ type: "error", text, duration: 2000 });
};

export const playHandHandler = async (params: PlayHandHandlerParams) => {
  let playData: CheckIsPlayableReturnType;
  if (params.checkIsPlayable) {
    playData = params.checkIsPlayable(params.domino);
  } else if (params.isPlayable) {
    playData = params.isPlayable;
  }
  const index = params.players.findIndex((p) => p.id === auth.currentUser.uid);
  if (playData.isPlayable && index !== -1) {
    const playedDomino = playData.swap
      ? params.domino.substring(1) + params.domino.substring(0, 1)
      : params.domino;
    const { success, message: text } = await playHand(
      auth.currentUser.uid,
      params.gameId,
      params.roundId,
      params.domino,
      playedDomino,
      playData.addTo,
      params.players[index < 3 ? index + 1 : 0].id
    );
    if (success)
      params.setTimedMessage({ type: "success", text, duration: 2000 });
    else params.setTimedMessage({ type: "error", text, duration: 2000 });
  }
};

export const passToNextPlayerHandler = async (
  params: PassToNextPlayerHandlerParams
) => {
  const index = params.players.findIndex((p) => p.id === auth.currentUser.uid);
  if (index !== -1) {
    const { message, success } = await passToNextPlayer(
      params.roundId,
      params.players[index < 3 ? index + 1 : 0].id,
      false
    );
    if (!success)
      params.setTimedMessage({
        type: "error",
        text: message,
        duration: 2000,
      });
  } else
    params.setTimedMessage({
      type: "error",
      text: "Problem with passing your turn!",
      duration: 2000,
    });
};

export const gamesOnSnapshotHandler = (
  params: GamesOnSnapshotHandlerParams
) => {
  if (
    params.data.players &&
    params.data.teamOnePlayers &&
    params.data.teamTwoPlayers
  ) {
    let newplayers: PlayersTurn[] = params.data.players.map((p: string) => {
      return { id: p };
    });
    params.data.teamOnePlayers.forEach((p: string) => {
      const pl = newplayers.find((e) => e.id === p);
      if (pl) pl.team = 1;
    });
    params.data.teamTwoPlayers.forEach((p: string) => {
      const pl = newplayers.find((e) => e.id === p);
      if (pl) pl.team = 2;
    });
    params.getPlayers(newplayers);
  }
  params.updateGame(params.data);
  if (
    params.data.status === "PLAYING" &&
    params.data.players.length === 4 &&
    params.data.rounds.length > 0
  ) {
    const roundId = params.data.rounds[params.data.rounds.length - 1];
    params.setRoundId(roundId);
    params.updatePlayers(params.data.players);
  }
  if (params.data.status === "PLAYING" && params.data.players.length < 4) {
    const message = "A player has left the game";
    const actions = [];
    if (auth.currentUser.uid === params.data.admin) {
      actions.push({
        title: "cancel the game",
        handler() {
          cancelGameHandler({
            admin: params.data.admin,
            gameId: params.data.id,
            ...params,
          });
        },
      });
    } else {
      actions.push({
        title: "exit the game",
        async handler() {
          await removePlayer(params.data.id, auth.currentUser.uid);
          params.resetGame();
          params.resetRound();
          params.resetHand();
          params.resetPlayers();
          params.resetActions();
          params.navigation.navigate("Home");
        },
      });
    }
    params.setAction(message, actions);
    params.setTimedMessage({ type: "error", text: message, duration: 5000 });
  }
};

export const roundsOnSnapshotHandler = async (
  params: RoundsOnSnapshotHandlerParams
) => {
  params.updateRound(params.data);
  if (params.data.id && params.data.board && params.data.startingDomino) {
    await shiftBoard(
      params.data.id,
      params.data.board,
      params.data.startingDomino
    );
  }
  const isTurn =
    params.data.turn &&
    auth.currentUser &&
    params.data.turn === auth.currentUser.uid &&
    params.playerId === params.data.turn &&
    params.hand &&
    params.hand.length > 0;
  if (isTurn) {
    if (params.data.board && params.rounds && params.status === "PLAYING") {
      if (params.data.passCount <= 4) {
        await roundBlocked(
          params.gameId,
          params.roundId,
          params.teamOnePlayers,
          params.teamTwoPlayers
        );
      } else {
        let canPlay = false;
        for (let domino of params.hand) {
          canPlay = checkIsDominoPlayable(
            domino,
            params.data.status,
            params.data.turn,
            auth.currentUser.uid,
            params.data.board,
            params.rounds
          );
          if (canPlay) break;
        }
        if (!canPlay && isTurn) {
          const index = params.players.findIndex(
            (p) => p.id === auth.currentUser.uid
          );
          await passToNextPlayer(
            params.roundId,
            params.players[index < 3 ? index + 1 : 0].id,
            false
          );
        }
      }
    }
  }
};
