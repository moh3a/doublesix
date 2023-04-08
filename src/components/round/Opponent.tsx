import { auth } from "../../config/firebase.config";
import Colors from "../../constants/Colors";
import { useHand, usePlayers, useRound } from "../../hooks/store";
import { togglePlayerSpeaker } from "../../lib/helpers";
import Icon from "../shared/Icon";
import Text from "../shared/Text";
import View from "../shared/View";

const Opponent = () => {
  const { turn } = useRound();
  const { hand, playerId } = useHand();
  const { players } = usePlayers();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {players &&
        players.map((player, index) => {
          if (
            player &&
            player.id &&
            !(
              player.id === auth.currentUser.uid &&
              playerId === player.id &&
              hand &&
              hand.length > 0
            )
          ) {
            return (
              <View key={index} style={{ padding: 10, flex: 1 }}>
                <Text style={{ overflow: "hidden", height: 18 }}>
                  {player.name ?? player.id ?? ""}
                </Text>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 2,
                      width: 15,
                      height: 15,
                      borderRadius: 25,
                      backgroundColor:
                        turn === player.id ? Colors.red : "transparent",
                    }}
                  />
                  <View
                    style={{
                      marginHorizontal: 2,
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      backgroundColor:
                        player.team === 1 ? Colors.side_one : Colors.side_two,
                    }}
                  />
                  <Icon
                    onPress={togglePlayerSpeaker}
                    size={20}
                    style={{
                      marginHorizontal: 2,
                      textAlign: "center",
                    }}
                    color={Colors.primary}
                    name="volume-up"
                  />
                </View>
              </View>
            );
          }
        })}
    </View>
  );
};

export default Opponent;
