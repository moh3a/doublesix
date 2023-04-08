import { useState } from "react";
import { ScrollView } from "react-native";

import { useGame, useMessage } from "../../hooks/store";
import { joinGameHandler, joinPublicGameHandler } from "../../hooks/handlers";
import { JoinComponentProps } from "../../types";
import View from "../shared/View";
import Text from "../shared/Text";
import Button from "../shared/Button";
import TextInput from "../shared/TextInput";

const Join = ({ navigation }: JoinComponentProps) => {
  const [token, setToken] = useState("");
  const { setId } = useGame();
  const { setTimedMessage } = useMessage();

  return (
    <ScrollView>
      <View>
        <Text>Token:</Text>
        <TextInput
          placeholder="Entrer token here"
          value={token}
          setValue={setToken}
        />
      </View>
      {token && (
        <View>
          <Button
            onPress={() =>
              joinGameHandler({ navigation, setId, setTimedMessage, token })
            }
          >
            join the private game
          </Button>
        </View>
      )}
      <Text style={{ textAlign: "center", marginVertical: 30 }}>or</Text>
      <View>
        <Button
          onPress={() =>
            joinPublicGameHandler({ navigation, setId, setTimedMessage })
          }
        >
          join a public game
        </Button>
      </View>
    </ScrollView>
  );
};

export default Join;
