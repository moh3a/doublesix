import { useState } from "react";
import { ScrollView } from "react-native";

import { auth } from "../../config/firebase.config";
import View from "../shared/View";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import Login from "./Login";
import Details from "./Details";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import {
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../../hooks/store";
import {
  deleteAccountHandler,
  signOutHandler,
} from "../../hooks/handlers.auth";
import { RootTabScreenProps } from "../../types";

interface AccountProps {
  navigation: RootTabScreenProps<"Account">["navigation"];
}

const Account = ({ navigation }: AccountProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<"CREATE" | "LOGIN" | "LINK">();

  const { resetPlayers } = usePlayers();
  const { resetGame } = useGame();
  const { resetHand } = useHand();
  const { resetRound } = useRound();
  const { setTimedMessage } = useMessage();

  return (
    <ScrollView style={{ width: "100%", height: "100%" }}>
      <Details />
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: Layout.window.width / 10,
        }}
      >
        {(!auth.currentUser ||
          (auth.currentUser && auth.currentUser.isAnonymous)) && (
          <View style={{ marginVertical: 10 }}>
            <Button
              onPress={() => {
                setOpenModal(true);
                setAction("LOGIN");
              }}
            >
              sign in
            </Button>
          </View>
        )}
        {!auth.currentUser && (
          <View style={{ marginVertical: 10 }}>
            <Button
              onPress={() => {
                setOpenModal(true);
                setAction("CREATE");
              }}
            >
              create new account
            </Button>
          </View>
        )}
        {auth.currentUser && auth.currentUser.isAnonymous && (
          <View style={{ marginVertical: 20 }}>
            <Button
              onPress={() => {
                setOpenModal(true);
                setAction("LINK");
              }}
            >
              connect to a new account
            </Button>
          </View>
        )}
        {auth.currentUser && !auth.currentUser.isAnonymous && (
          <>
            <View style={{ marginVertical: 10 }}>
              <Button
                onPress={() =>
                  signOutHandler({
                    navigation,
                    resetGame,
                    resetHand,
                    resetPlayers,
                    resetRound,
                  })
                }
              >
                sign out
              </Button>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Button
                style={{
                  backgroundColor: Colors.red,
                  borderRadius: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                onPress={() =>
                  deleteAccountHandler({
                    navigation,
                    resetGame,
                    resetHand,
                    resetPlayers,
                    resetRound,
                    setTimedMessage,
                  })
                }
              >
                delete account
              </Button>
            </View>
          </>
        )}
      </View>
      <Modal open={openModal} setOpen={setOpenModal}>
        <Login setOpen={setOpenModal} action={action} />
      </Modal>
    </ScrollView>
  );
};

export default Account;
