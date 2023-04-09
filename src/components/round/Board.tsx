import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import View from "../shared/View";
import Layout from "../../constants/Layout";
import Domino from "../Domino";
import {
  useBoardPrompt,
  useGame,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import Colors from "../../constants/Colors";
import { playHandHandler } from "../../hooks/handlers";

const Board = () => {
  const { id: gameId } = useGame();
  const { id: roundId, board, startingDomino } = useRound();
  const { players } = usePlayers();
  const { setTimedMessage } = useMessage();
  const { domino, resetBoardPrompt } = useBoardPrompt();
  const [startingDominoIndex, setStartingDominoIndex] = useState<
    number | undefined
  >(
    board.findIndex((e) => e === startingDomino) === -1
      ? undefined
      : board.findIndex((e) => e === startingDomino)
  );

  useEffect(() => {
    const i = board.findIndex((e) => e === startingDomino);
    setStartingDominoIndex(i === -1 ? undefined : i);
  }, [board]);

  const addToBackHandler = async () => {
    const newdomino = domino;
    let dA = parseInt(domino.substring(0, 1));
    let dB = parseInt(domino.substring(1));
    let backValue = parseInt(board[board.length - 1].substring(1));
    let isPlayable: any = {
      addTo: "back",
      isPlayable: true,
    };
    if (dA === backValue) {
      isPlayable.swap = false;
    } else if (dB === backValue) {
      isPlayable.swap = true;
    }
    resetBoardPrompt();
    await playHandHandler({
      domino: newdomino,
      isPlayable,
      gameId,
      players,
      roundId,
      setTimedMessage,
    });
  };

  const addToFrontHandler = async () => {
    const newdomino = domino;
    let dA = parseInt(domino.substring(0, 1));
    let dB = parseInt(domino.substring(1));
    let frontValue = parseInt(board[0].substring(0, 1));
    let isPlayable: any = {
      addTo: "front",
      isPlayable: true,
    };
    if (dA === frontValue) {
      isPlayable.swap = true;
    } else if (dB === frontValue) {
      isPlayable.swap = false;
    }
    resetBoardPrompt();
    await playHandHandler({
      domino: newdomino,
      isPlayable,
      gameId,
      players,
      roundId,
      setTimedMessage,
    });
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Layout.window.width,
        height: Layout.window.height - Layout.window.height / 3.6,
      }}
    >
      {board && startingDomino && (
        <View style={{ position: "relative" }}>
          {startingDominoIndex >= 9 && (
            <View
              style={{
                ...styles.boardRow,
                flexDirection: "row",
                top: -218,
                right: -146,
              }}
            >
              {domino &&
                startingDominoIndex > 8 &&
                startingDominoIndex < 15 && (
                  <TouchableOpacity
                    onPress={addToFrontHandler}
                    style={styles.domino}
                  >
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={270}
                      blank={true}
                      backgroundColor={Colors.gray}
                      top={0}
                      bottom={0}
                    />
                  </TouchableOpacity>
                )}
              {board.slice(0, startingDominoIndex - 9).map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={270}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            </View>
          )}
          {startingDominoIndex >= 8 && (
            <View
              style={{
                ...styles.boardRow,
                top: -164,
                right: -164,
              }}
            >
              {domino && startingDominoIndex === 8 && (
                <TouchableOpacity
                  onPress={addToFrontHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={0}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
              {board
                .slice(startingDominoIndex - 9, startingDominoIndex - 8)
                .map((domino, index) => (
                  <View key={index} style={styles.domino}>
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={0}
                      top={parseInt(domino.substring(0, 1))}
                      bottom={parseInt(domino.substring(1))}
                    />
                  </View>
                ))}
            </View>
          )}
          {startingDominoIndex >= 3 && (
            <View
              style={{
                ...styles.boardRow,
                flexDirection: "row-reverse",
                top: -110,
                left: -144,
              }}
            >
              {domino && startingDominoIndex > 2 && startingDominoIndex < 8 && (
                <TouchableOpacity
                  onPress={addToFrontHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={90}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
              {board
                .slice(
                  startingDominoIndex >= 8 ? startingDominoIndex - 8 : 0,
                  startingDominoIndex - 3
                )
                .map((domino, index) => (
                  <View key={index} style={styles.domino}>
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={90}
                      top={parseInt(domino.substring(0, 1))}
                      bottom={parseInt(domino.substring(1))}
                    />
                  </View>
                ))}
            </View>
          )}
          {startingDominoIndex >= 2 && (
            <View
              style={{
                ...styles.boardRow,
                flexDirection: "row",
                top: -56,
                right: 160,
              }}
            >
              {domino && startingDominoIndex === 2 && (
                <TouchableOpacity
                  onPress={addToFrontHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={0}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
              {board
                .slice(startingDominoIndex - 3, startingDominoIndex - 2)
                .map((domino, index) => (
                  <View key={index} style={styles.domino}>
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={0}
                      top={parseInt(domino.substring(0, 1))}
                      bottom={parseInt(domino.substring(1))}
                    />
                  </View>
                ))}
            </View>
          )}
          {startingDominoIndex > 0 && (
            <View
              style={{
                ...styles.boardRow,
                flexDirection: "row",
                right: 72,
              }}
            >
              {domino &&
                startingDominoIndex >= 0 &&
                startingDominoIndex < 2 && (
                  <TouchableOpacity
                    onPress={addToFrontHandler}
                    style={styles.domino}
                  >
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={270}
                      blank={true}
                      backgroundColor={Colors.gray}
                      top={0}
                      bottom={0}
                    />
                  </TouchableOpacity>
                )}
              {board
                .slice(
                  startingDominoIndex >= 2 ? startingDominoIndex - 2 : 0,
                  startingDominoIndex
                )
                .map((domino, index) => (
                  <View key={index} style={styles.domino}>
                    <Domino
                      height={Layout.window.width / 5.5}
                      width={Layout.window.height / 11}
                      rotation={270}
                      top={parseInt(domino.substring(0, 1))}
                      bottom={parseInt(domino.substring(1))}
                    />
                  </View>
                ))}
            </View>
          )}
          {/**
           * <-- BACK BOARD
           */}
          {/**
           * STARTING DOMINO
           */}
          <View
            style={{
              position: "relative",
              backgroundColor: "transparent",
              top: 0,
              right: 0,
              left: 0,
            }}
          >
            <Domino
              height={Layout.window.width / 5.5}
              width={Layout.window.height / 11}
              rotation={270}
              top={parseInt(startingDomino.substring(0, 1))}
              bottom={parseInt(startingDomino.substring(1))}
            />
          </View>
          {/**
           * FRONT BOARD -->
           */}
          <View
            style={{
              ...styles.boardRow,
              flexDirection: "row",
              left: 72,
            }}
          >
            {board
              .slice(startingDominoIndex + 1, startingDominoIndex + 3)
              .map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={270}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            {domino &&
              board.length > startingDominoIndex &&
              board.length < startingDominoIndex + 3 && (
                <TouchableOpacity
                  onPress={addToBackHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={270}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
          </View>
          <View
            style={{
              ...styles.boardRow,
              top: 56,
              left: 160,
            }}
          >
            {board
              .slice(startingDominoIndex + 3, startingDominoIndex + 4)
              .map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={0}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            {domino && board.length === startingDominoIndex + 3 && (
              <TouchableOpacity
                onPress={addToBackHandler}
                style={styles.domino}
              >
                <Domino
                  height={Layout.window.width / 5.5}
                  width={Layout.window.height / 11}
                  rotation={0}
                  blank={true}
                  backgroundColor={Colors.gray}
                  top={0}
                  bottom={0}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              ...styles.boardRow,
              flexDirection: "row-reverse",
              top: 110,
              right: -144,
            }}
          >
            {board
              .slice(startingDominoIndex + 4, startingDominoIndex + 9)
              .map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={90}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            {domino &&
              board.length > startingDominoIndex + 3 &&
              board.length < startingDominoIndex + 9 && (
                <TouchableOpacity
                  onPress={addToBackHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={90}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
          </View>
          <View
            style={{
              ...styles.boardRow,
              top: 165,
              left: -164,
            }}
          >
            {board
              .slice(startingDominoIndex + 9, startingDominoIndex + 10)
              .map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={0}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            {domino && board.length === startingDominoIndex + 9 && (
              <TouchableOpacity
                onPress={addToBackHandler}
                style={styles.domino}
              >
                <Domino
                  height={Layout.window.width / 5.5}
                  width={Layout.window.height / 11}
                  rotation={0}
                  blank={true}
                  backgroundColor={Colors.gray}
                  top={0}
                  bottom={0}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              ...styles.boardRow,
              flexDirection: "row",
              top: 220,
              left: -146,
              right: 0,
            }}
          >
            {board
              .slice(startingDominoIndex + 10, startingDominoIndex + 15)
              .map((domino, index) => (
                <View key={index} style={styles.domino}>
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={270}
                    top={parseInt(domino.substring(0, 1))}
                    bottom={parseInt(domino.substring(1))}
                  />
                </View>
              ))}
            {domino &&
              board.length > startingDominoIndex + 9 &&
              board.length < startingDominoIndex + 15 && (
                <TouchableOpacity
                  onPress={addToBackHandler}
                  style={styles.domino}
                >
                  <Domino
                    height={Layout.window.width / 5.5}
                    width={Layout.window.height / 11}
                    rotation={270}
                    blank={true}
                    backgroundColor={Colors.gray}
                    top={0}
                    bottom={0}
                  />
                </TouchableOpacity>
              )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  boardRow: {
    backgroundColor: "transparent",
    position: "absolute",
    display: "flex",
  },
  domino: { backgroundColor: "transparent", zIndex: 10 },
});

export default Board;
