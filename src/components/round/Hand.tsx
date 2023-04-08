import { Dispatch, SetStateAction, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import { auth } from "../../config/firebase.config";
import Layout from "../../constants/Layout";
import {
  useBoardPrompt,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import { playHandHandler } from "../../hooks/handlers";
import Domino from "../Domino";
import View from "../shared/View";
import { CheckIsPlayableReturnType } from "../../types";

const Hand = ({ setPass }: { setPass: Dispatch<SetStateAction<boolean>> }) => {
  const { rounds, id: gameId } = useGame();
  const { hand } = useHand();
  const { turn, id: roundId, status, board } = useRound();
  const { players } = usePlayers();
  const { setTimedMessage } = useMessage();
  const {
    domino: promptDomino,
    setBoardPrompt,
    resetBoardPrompt,
  } = useBoardPrompt();

  const checkIsPlayable = (domino: string): CheckIsPlayableReturnType => {
    let dA = parseInt(domino.substring(0, 1));
    let dB = parseInt(domino.substring(1));
    if (
      board &&
      rounds &&
      status === "PLAYING" &&
      auth.currentUser &&
      turn === auth.currentUser.uid
    ) {
      if (board.length === 0) {
        if (rounds.length > 1) {
          return { isPlayable: true, addTo: "back", swap: false };
        } else if (rounds.length === 1) {
          if (dA === 6 && dB === 6)
            return { isPlayable: true, addTo: "back", swap: false };
          else return { isPlayable: false, addTo: "back", swap: false };
        }
      } else if (board.length > 0) {
        let frontValue = parseInt(board[0].substring(0, 1));
        let backValue = parseInt(board[board.length - 1].substring(1));
        if (
          (dA === frontValue || dB === frontValue) &&
          (dA === backValue || dB === backValue)
        ) {
          setBoardPrompt(domino);
          return { isPlayable: false, addTo: "back", swap: true };
        } else if (dA === dB && dA === frontValue) {
          return { isPlayable: true, addTo: "front", swap: false };
        } else if (dA === dB && dA === backValue) {
          return { isPlayable: true, addTo: "back", swap: false };
        } else if (dB === backValue) {
          return { isPlayable: true, addTo: "back", swap: true };
        } else if (dA === backValue) {
          return { isPlayable: true, addTo: "back", swap: false };
        } else if (dB === frontValue) {
          return { isPlayable: true, addTo: "front", swap: false };
        } else if (dA === frontValue) {
          return { isPlayable: true, addTo: "front", swap: true };
        } else return { isPlayable: false, addTo: "back", swap: false };
      } else return { isPlayable: false, addTo: "back", swap: false };
    } else return { isPlayable: false, addTo: "back", swap: false };
  };

  const checkForStyling = (domino: string): boolean => {
    let dA = parseInt(domino.substring(0, 1));
    let dB = parseInt(domino.substring(1));
    if (
      board &&
      rounds &&
      status === "PLAYING" &&
      auth.currentUser &&
      auth.currentUser.uid === turn
    ) {
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

  useEffect(() => {
    if (
      hand &&
      turn &&
      auth.currentUser &&
      auth.currentUser.uid === turn &&
      status === "PLAYING"
    ) {
      let canPlay = false;
      for (let domino of hand) {
        canPlay = checkForStyling(domino);
        if (canPlay) break;
      }
      if (!canPlay) setPass(true);
      else setPass(false);
    } else setPass(false);
  }, [turn, status]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hand.map((domino, index) => (
        <TouchableOpacity
          key={index}
          disabled={
            (promptDomino && promptDomino !== domino) ||
            (!promptDomino && turn !== auth.currentUser.uid)
          }
          onPress={() =>
            promptDomino
              ? resetBoardPrompt()
              : playHandHandler({
                  domino,
                  checkIsPlayable,
                  gameId,
                  players,
                  roundId,
                  setTimedMessage,
                })
          }
          style={{
            marginHorizontal: 3,
            borderRadius: 5,
            transform: [
              {
                translateY:
                  promptDomino === domino
                    ? -20
                    : !promptDomino && checkForStyling(domino)
                    ? -20
                    : 0,
              },
            ],
          }}
        >
          <Domino
            width={Layout.window.width / 8}
            top={parseInt(domino.substring(0, 1))}
            bottom={parseInt(domino.substring(1))}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Hand;
