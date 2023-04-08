import { auth } from "../../config/firebase.config";
import Colors from "../../constants/Colors";
import {
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import { createNewRoundHandler } from "../../hooks/handlers";
import Button from "../shared/Button";
import Text from "../shared/Text";
import View from "../shared/View";
import { RoundComponentProps } from "../../types";
import Layout from "../../constants/Layout";

const RoundFinished = ({ navigation }: RoundComponentProps) => {
  const { id: gameId, admin } = useGame();
  const {
    id: roundId,
    status,
    winner,
    winningTeam,
    pointsWon,
    resetRound,
    setRoundId,
  } = useRound();
  const { resetHand } = useHand();
  const { players } = usePlayers();
  const { setTimedMessage } = useMessage();

  return (
    <View style={{ margin: 10 }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "800",
          fontSize: Layout.window.height / 25,
          marginBottom: Layout.window.height / 30,
        }}
      >
        ROUND {status.toUpperCase()}
      </Text>
      {winner && (
        <View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "200",
              fontSize: Layout.window.height / 36,
              marginVertical: Layout.window.height / 50,
            }}
          >
            Good job{" "}
            {players &&
              players.find((e) => e && e.id && e.id === winner) &&
              players.find((e) => e && e.id && e.id === winner).name}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "400",
              fontSize: Layout.window.height / 28,
              marginVertical: Layout.window.height / 50,
            }}
          >
            Winners are{" "}
            <Text
              style={{
                color: winningTeam === 1 ? Colors.side_one : Colors.side_two,
                fontWeight: "800",
              }}
            >
              TEAM {winningTeam}
            </Text>
          </Text>
          <Text
            style={{
              marginVertical: Layout.window.height / 40,
              textAlign: "center",
              fontWeight: "800",
              fontSize: Layout.window.height / 18,
              color: Colors.primary,
            }}
          >
            + {pointsWon} points
          </Text>
        </View>
      )}
      <View
        style={{
          marginVertical: Layout.window.height / 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ marginVertical: 4 }}>
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
        <View style={{ marginVertical: 4 }}>
          <Button onPress={() => navigation.navigate("Server", { gameId })}>
            back to lobby
          </Button>
        </View>
      </View>
    </View>
  );
};

export default RoundFinished;
