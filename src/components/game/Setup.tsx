import { Image, ScrollView } from "react-native";
import { SvgUri } from "react-native-svg";
import Clipboard from "@react-native-clipboard/clipboard";

import { auth } from "../../config/firebase.config";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import TeamCard from "./TeamCard";
import Text from "../shared/Text";
import View from "../shared/View";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import TextInput from "../shared/TextInput";
import Colors from "../../constants/Colors";
import { togglePlayerSpeaker } from "../../lib/helpers";
import { LobbyComponentProps } from "../../types";
import {
  cancelGameHandler,
  chooseTeammateHandler,
  exitGameHandler,
  removePlayerHandler,
  startGameHandler,
} from "../../hooks/handlers";

const GameSetup = ({ navigation }: LobbyComponentProps) => {
  const {
    id,
    admin,
    token,
    teamOnePlayers,
    teamOneScore,
    teamTwoPlayers,
    teamTwoScore,
    resetGame,
  } = useGame();
  const { id: roundId, setRoundId, resetRound } = useRound();
  const { players, resetPlayers } = usePlayers();
  const { resetHand } = useHand();
  const { setTimedMessage } = useMessage();
  const { setAction, resetActions } = useAction();

  return (
    <ScrollView style={{ width: "100%" }}>
      <Text style={{ textAlign: "center" }}>~ game setup ~</Text>
      {token && (
        <View style={{ marginVertical: 25 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>Token</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput value={token} placeholder={token} />
            <Icon
              onPress={() => Clipboard.setString(token)}
              style={{ padding: 10 }}
              size={20}
              color={Colors.gray}
              name="clipboard"
            />
          </View>
        </View>
      )}
      {players && players.length > 0 && (
        <View style={{ marginVertical: 25, marginHorizontal: 5 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>
            Players
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              shadowRadius: 5,
              shadowOpacity: 0.5,
              shadowColor: Colors.gray,
              elevation: 20,
            }}
          >
            {players.map((player, index) => (
              <View
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
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
                      marginLeft: 8,
                    }}
                  >
                    {player.name ?? player.id}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {auth.currentUser && auth.currentUser.uid === player.id && (
                    <Text style={{ fontWeight: "800", padding: 10 }}>you</Text>
                  )}
                  <Icon
                    onPress={togglePlayerSpeaker}
                    size={20}
                    style={{ padding: 10 }}
                    color={Colors.primary}
                    name="volume-up"
                  />
                  {auth.currentUser &&
                    auth.currentUser.uid === admin &&
                    player.id !== admin && (
                      <Icon
                        onPress={() =>
                          removePlayerHandler({
                            gameId: id,
                            playerId: player.id,
                            admin,
                            navigation,
                            setTimedMessage,
                          })
                        }
                        style={{ padding: 10 }}
                        size={20}
                        color={Colors.red}
                        name="trash"
                      />
                    )}
                  {auth.currentUser &&
                    auth.currentUser.uid === admin &&
                    player.id !== admin &&
                    teamOnePlayers &&
                    teamOnePlayers.length < 2 && (
                      <Icon
                        onPress={() =>
                          chooseTeammateHandler({
                            gameId: id,
                            playerId: player.id,
                            admin,
                            setTimedMessage,
                          })
                        }
                        style={{ padding: 10 }}
                        size={20}
                        color={Colors.primary}
                        name="user-plus"
                      />
                    )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
      {teamOnePlayers && teamTwoPlayers && (
        <View style={{ marginVertical: 25, marginHorizontal: 5 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>Teams</Text>
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
        {auth.currentUser && auth.currentUser.uid === admin && (
          <View style={{ margin: 4 }}>
            <Button
              onPress={() =>
                cancelGameHandler({
                  admin,
                  gameId: id,
                  navigation,
                  resetGame,
                  resetHand,
                  resetPlayers,
                  resetRound,
                })
              }
            >
              cancel the game
            </Button>
          </View>
        )}
        {auth.currentUser && auth.currentUser.uid !== admin && (
          <View style={{ margin: 4 }}>
            <Button
              onPress={() =>
                exitGameHandler({
                  gameId: id,
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
            >
              exit the game
            </Button>
          </View>
        )}
        <View style={{ margin: 4 }}>
          <Button
            disabled={
              !(
                auth.currentUser &&
                auth.currentUser.uid === admin &&
                players &&
                players.length === 4 &&
                teamOnePlayers &&
                teamOnePlayers.length === 2 &&
                teamTwoPlayers &&
                teamTwoPlayers.length === 2
              )
            }
            onPress={() =>
              startGameHandler({
                admin,
                gameId: id,
                navigation,
                players,
                resetRound,
                roundId,
                setRoundId,
                setTimedMessage,
                teamOnePlayers,
                teamTwoPlayers,
                resetHand,
              })
            }
          >
            start the game
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default GameSetup;
