import { useEffect } from "react";

import { auth } from "../../config/firebase.config";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import Board from "./Board";
import Opponent from "./Opponent";
import POV from "./POV";
import ScoreBanner from "./ScoreBanner";
import RoundFinished from "./RoundFinished";
import Text from "../shared/Text";
import View from "../shared/View";
import Modal from "../shared/Modal";
import { RoundComponentProps } from "../../types";
import { exitGameHandler } from "../../hooks/handlers";

const Canvas = ({ navigation }: RoundComponentProps) => {
  const {
    id: gameId,
    rounds,
    status: gameStatus,
    teamOnePlayers,
    teamTwoPlayers,
    score,
    resetGame,
  } = useGame();
  const { id, status, board, turn, startingPlayer, resetRound } = useRound();
  const { hand, playerId, resetHand } = useHand();
  const { players, resetPlayers } = usePlayers();
  const { setTimedMessage } = useMessage();
  const { setAction, resetActions } = useAction();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!(gameStatus === "PLAYING" && status === "PLAYING")) {
          return;
        }
        e.preventDefault();
        exitGameHandler({
          setAction,
          gameId,
          setTimedMessage,
          resetGame,
          resetHand,
          resetPlayers,
          resetRound,
          resetActions,
          navigation,
        });
      }),
    [navigation, status, gameStatus]
  );

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {gameStatus && status && (
        <Modal open={gameStatus === "PLAYING" && status !== "PLAYING"}>
          <RoundFinished navigation={navigation} />
        </Modal>
      )}
      {id &&
      board &&
      rounds &&
      turn &&
      startingPlayer &&
      players &&
      players.length === 4 &&
      teamOnePlayers &&
      teamOnePlayers.length === 2 &&
      teamTwoPlayers &&
      teamTwoPlayers.length === 2 ? (
        <>
          {score && <ScoreBanner />}
          {players && players.length > 0 && <Opponent />}
          <Board />
          {playerId === auth.currentUser.uid && hand && hand.length > 0 && (
            <POV navigation={navigation} />
          )}
        </>
      ) : (
        <View
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>starting game...</Text>
        </View>
      )}
    </View>
  );
};

export default Canvas;
