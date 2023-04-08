import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import View from "../components/shared/View";
import GameSetup from "../components/game/Setup";
import GameLobby from "../components/game/Lobby";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../hooks/store";
import { RootTabScreenProps } from "../types";
import { exitGameHandler } from "../hooks/handlers";

export default function ServerScreen({
  navigation,
}: RootTabScreenProps<"Server">) {
  const insets = useSafeAreaInsets();
  const { id: gameId, status, resetGame } = useGame();
  const { resetRound } = useRound();
  const { resetPlayers } = usePlayers();
  const { resetHand } = useHand();
  const { setAction, resetActions } = useAction();
  const { setTimedMessage } = useMessage();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (status === "FINISHED") {
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
    [navigation, status]
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      {status === "IDLE" ? (
        <GameSetup navigation={navigation} />
      ) : (
        <GameLobby navigation={navigation} />
      )}
    </View>
  );
}
