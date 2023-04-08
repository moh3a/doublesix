import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { auth } from "../../config/firebase.config";
import Colors from "../../constants/Colors";
import { exitGameHandler, passToNextPlayerHandler } from "../../hooks/handlers";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import { togglePlayerSpeaker } from "../../lib/helpers";
import Icon from "../shared/Icon";
import Text from "../shared/Text";
import View from "../shared/View";
import Hand from "./Hand";
import { RoundComponentProps } from "../../types";

const POV = ({ navigation }: RoundComponentProps) => {
  const [pass, setPass] = useState(false);
  const { id: gameId, resetGame } = useGame();
  const { id: roundId, turn, resetRound } = useRound();
  const { playerId, resetHand } = useHand();
  const { players, resetPlayers } = usePlayers();
  const { setAction, resetActions } = useAction();
  const { setTimedMessage } = useMessage();

  return (
    <View style={{ width: "100%" }}>
      {players && (
        <>
          <Hand setPass={setPass} />
          <View
            style={{
              padding: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text style={{ flex: 6 }}>{auth.currentUser.displayName}</Text>
            {pass && (
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                  borderRadius: 5,
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  backgroundColor: Colors.red,
                }}
                onPress={() =>
                  passToNextPlayerHandler({ players, roundId, setTimedMessage })
                }
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: Colors.white,
                  }}
                >
                  pass
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                marginHorizontal: 10,
                width: 15,
                height: 15,
                borderRadius: 25,
                backgroundColor: turn === playerId ? Colors.red : "transparent",
              }}
            />
            <View
              style={{
                marginHorizontal: 10,
                width: 20,
                height: 20,
                borderRadius: 5,
                backgroundColor: players.find((p) => p && p.id === playerId)
                  ? players.find((p) => p && p.id === playerId).team === 1
                    ? Colors.side_one
                    : Colors.side_two
                  : Colors.gray,
              }}
            />
            <Icon
              onPress={togglePlayerSpeaker}
              size={20}
              style={{
                marginHorizontal: 10,
                textAlign: "center",
              }}
              color={Colors.primary}
              name="volume-up"
            />
            <Icon
              onPress={() =>
                exitGameHandler({
                  gameId,
                  navigation,
                  resetActions,
                  setAction,
                  setTimedMessage,
                  resetGame,
                  resetHand,
                  resetPlayers,
                  resetRound,
                })
              }
              size={20}
              style={{ marginHorizontal: 10, textAlign: "center" }}
              color={Colors.primary}
              name="sign-out"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default POV;
