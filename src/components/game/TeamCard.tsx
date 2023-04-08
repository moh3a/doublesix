import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

import Colors from "../../constants/Colors";
import { useGame, usePlayers } from "../../hooks/store";
import Text from "../shared/Text";
import View from "../shared/View";
import { TeamCardComponentProps } from "../../types";

const TeamCard = ({ id, score }: TeamCardComponentProps) => {
  const { players } = usePlayers();
  const { status } = useGame();

  return (
    <View
      style={{
        height: "100%",
        borderRadius: 5,
        flex: 1,
        padding: 10,
        margin: 6,
        backgroundColor: id === 1 ? Colors.side_one : Colors.side_two,
      }}
    >
      <Text
        style={{
          margin: 10,
          color: id === 1 ? Colors.white : Colors.black,
          fontWeight: "800",
        }}
      >
        Team {id}
      </Text>
      {players.map((player) => {
        if (player.team === id) {
          return (
            <View
              key={player.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                margin: 5,
                backgroundColor: "transparent",
              }}
            >
              {player.photoURL ? (
                <>
                  {player.photoURL.includes(".svg") ? (
                    <SvgUri
                      uri={player.photoURL}
                      width={20}
                      height={20}
                      style={{ borderRadius: 25 }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: player.photoURL,
                        width: 20,
                        height: 20,
                      }}
                      style={{ borderRadius: 25 }}
                    />
                  )}
                </>
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 25,
                    backgroundColor: "transparent",
                  }}
                />
              )}
              <Text
                style={{
                  color: id === 1 ? Colors.white : Colors.black,
                  marginLeft: 8,
                }}
              >
                {player.name}
              </Text>
            </View>
          );
        }
      })}
      {status !== "IDLE" && (
        <Text
          style={{
            margin: 10,
            color: id === 1 ? Colors.white : Colors.black,
            fontWeight: "800",
          }}
        >
          Score: {score}
        </Text>
      )}
    </View>
  );
};

export default TeamCard;
