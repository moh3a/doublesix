import { useState } from "react";
import { ScrollView } from "react-native";

import Domino from "./Domino";
import Button from "./shared/Button";
import Modal from "./shared/Modal";
import Text from "./shared/Text";
import View from "./shared/View";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../hooks/store";
import { checkPastGamesHandler, createGameHandler } from "../hooks/handlers";
import { RootTabScreenProps } from "../types";

interface HomeProps {
  navigation: RootTabScreenProps<"Home">["navigation"];
}

const Home = ({ navigation }: HomeProps) => {
  const [openModal, setOpenModal] = useState(false);

  const { setId, resetGame } = useGame();
  const { setRoundId, resetRound } = useRound();
  const { resetHand } = useHand();
  const { setTimedMessage } = useMessage();
  const { setAction, resetActions } = useAction();
  const { resetPlayers } = usePlayers();

  return (
    <ScrollView style={{ height: "100%", width: "100%" }}>
      <Text style={{ textAlign: "center" }}>~ double six ~</Text>
      <View
        style={{
          paddingVertical: Layout.window.height / 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Domino
          top={1}
          bottom={3}
          rotation={45}
          height={Layout.window.height / 4}
          width={Layout.window.width / 4}
          backgroundColor={Colors.white}
          color={Colors.primary}
        />
      </View>
      <View
        style={{
          marginVertical: 2,
          marginHorizontal: Layout.window.width / 10,
        }}
      >
        <Button
          onPress={() =>
            checkPastGamesHandler({
              action: "CREATE",
              navigation,
              resetActions,
              resetGame,
              resetHand,
              resetPlayers,
              resetRound,
              setAction,
              setId,
              setOpenModal,
              setRoundId,
            })
          }
        >
          new game
        </Button>
      </View>
      <View
        style={{
          marginVertical: 2,
          marginHorizontal: Layout.window.width / 10,
        }}
      >
        <Button
          onPress={() =>
            checkPastGamesHandler({
              action: "JOIN",
              navigation,
              resetActions,
              resetGame,
              resetHand,
              resetPlayers,
              resetRound,
              setAction,
              setId,
              setOpenModal,
              setRoundId,
            })
          }
        >
          join game
        </Button>
      </View>
      <View
        style={{
          marginVertical: 2,
          marginHorizontal: Layout.window.width / 10,
        }}
      >
        <Button onPress={() => navigation.navigate("NotFound")}>
          play offline
        </Button>
      </View>
      <Modal open={openModal} setOpen={setOpenModal}>
        <View style={{ margin: 10 }}>
          <Text style={{ marginVertical: 20 }}>Do you want to create a...</Text>
          <View style={{ marginVertical: 5 }}>
            <Button
              onPress={() =>
                createGameHandler({
                  type: "PUBLIC",
                  navigation,
                  resetGame,
                  resetHand,
                  resetPlayers,
                  resetRound,
                  setId,
                  setOpenModal,
                  setTimedMessage,
                })
              }
            >
              public game
            </Button>
          </View>
          <View style={{ marginVertical: 5 }}>
            <Button
              onPress={() =>
                createGameHandler({
                  type: "PRIVATE",
                  navigation,
                  resetGame,
                  resetHand,
                  resetPlayers,
                  resetRound,
                  setId,
                  setOpenModal,
                  setTimedMessage,
                })
              }
            >
              private game
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;
