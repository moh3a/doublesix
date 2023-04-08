import { ScrollView } from "react-native";

import { auth } from "../../config/firebase.config";
import { useGame, useHand, useMessage, useRound } from "../../hooks/store";
import { createNewRoundHandler } from "../../hooks/handlers";
import TeamCard from "./TeamCard";
import Text from "../shared/Text";
import View from "../shared/View";
import Button from "../shared/Button";
import { LobbyComponentProps } from "../../types";

const GameLobby = ({ navigation }: LobbyComponentProps) => {
  const {
    id: gameId,
    status,
    admin,
    teamOnePlayers,
    teamOneScore,
    teamTwoPlayers,
    teamTwoScore,
  } = useGame();
  const {
    status: roundStatus,
    id: roundId,
    setRoundId,
    resetRound,
  } = useRound();
  const { resetHand } = useHand();
  const { setTimedMessage } = useMessage();

  return (
    <ScrollView style={{ width: "100%" }}>
      {teamOnePlayers && teamTwoPlayers && (
        <View style={{ marginVertical: 25, marginHorizontal: 5 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>Score</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TeamCard key={1} id={1} score={teamOneScore} />
            <TeamCard key={2} id={2} score={teamTwoScore} />
          </View>
        </View>
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          marginVertical: 25,
        }}
      >
        {status !== "FINISHED" && (
          <>
            {roundStatus === "PLAYING" ? (
              <View style={{ margin: 4 }}>
                <Button
                  onPress={() =>
                    navigation.navigate("Room", { gameId, roundId })
                  }
                >
                  continue current round
                </Button>
              </View>
            ) : (
              <View style={{ margin: 4 }}>
                <Button
                  disabled={!(auth.currentUser.uid === admin && gameId)}
                  onPress={() =>
                    createNewRoundHandler({
                      gameId,
                      navigation,
                      resetRound,
                      resetHand,
                      roundId,
                      setRoundId,
                      setTimedMessage,
                    })
                  }
                >
                  start new round
                </Button>
              </View>
            )}
          </>
        )}
        {status === "FINISHED" && (
          <View style={{ margin: 4 }}>
            <Button onPress={() => navigation.navigate("Home")}>
              back home
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GameLobby;
