import { TouchableOpacity, StyleSheet } from "react-native";

import { auth } from "../../config/firebase.config";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import Domino from "../Domino";
import Icon from "../shared/Icon";
import Text from "../shared/Text";
import View from "../shared/View";
import { useState } from "react";
import Modal from "../shared/Modal";
import TextInput from "../shared/TextInput";
import Button from "../shared/Button";
import { updateProfile } from "firebase/auth";

const Details = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");

  const editUsernameHandler = async () => {
    if (username)
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
    setIsOpen(false);
  };

  return (
    <View>
      <Text style={{ textAlign: "center" }}>~~ account details ~~</Text>
      <View style={styles.container}>
        <Domino
          top={1}
          bottom={2}
          rotation={45}
          height={Layout.window.height / 4}
          width={Layout.window.width / 4}
          backgroundColor={Colors.white}
          color={Colors.primary}
        />
      </View>
      {auth.currentUser && (
        <>
          <View style={styles.row}>
            <Text style={{ flex: 2, fontSize: 20 }}>Anonymous? ~</Text>
            {auth.currentUser.isAnonymous ? (
              <Text style={{ flex: 3, fontSize: 20, color: Colors.red }}>
                True
              </Text>
            ) : (
              <Text style={{ flex: 3, fontSize: 20, color: Colors.green }}>
                False
              </Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 2, fontSize: 20 }}>Name ~</Text>
            <View style={{ flex: 3, display: "flex", flexDirection: "row" }}>
              <Text style={{ fontSize: 20 }}>
                {auth.currentUser.displayName}
              </Text>
              <TouchableOpacity style={{ marginHorizontal: 10 }}>
                <Icon
                  onPress={() => setIsOpen(true)}
                  color={Colors.light.text}
                  name="pencil-square-o"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 2, fontSize: 20 }}>Email ~</Text>
            <Text style={{ flex: 3, fontSize: 20 }}>
              {auth.currentUser.email}
            </Text>
          </View>
        </>
      )}
      <Modal open={isOpen} setOpen={setIsOpen}>
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 40,
            marginBottom: 20,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 2, justifyContent: "center" }}>
            <Text>New username</Text>
          </View>
          <View style={{ flex: 3, justifyContent: "center" }}>
            <TextInput
              placeholder="username"
              value={username}
              setValue={setUsername}
            />
          </View>
        </View>
        <View style={{ margin: 20 }}>
          <View style={{ marginVertical: 5 }}>
            <Button onPress={editUsernameHandler}>save</Button>
          </View>
          <View style={{ marginVertical: 5 }}>
            <Button onPress={() => setIsOpen(false)}>cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    marginHorizontal: 20,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
  },
});

export default Details;
