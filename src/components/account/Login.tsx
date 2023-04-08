import { useState } from "react";

import Button from "../shared/Button";
import Text from "../shared/Text";
import TextInput from "../shared/TextInput";
import View from "../shared/View";
import { useMessage } from "../../hooks/store";
import { signInHandler } from "../../hooks/handlers.auth";
import { LoginComponentProps } from "../../types";

const Login = ({ setOpen, action }: LoginComponentProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setTimedMessage } = useMessage();

  return (
    <View style={{ margin: 15 }}>
      {action === "CREATE" && (
        <View style={{ marginVertical: 10 }}>
          <Text>Username</Text>
          <TextInput
            placeholder="username"
            value={username}
            setValue={setUsername}
          />
        </View>
      )}
      <View style={{ marginVertical: 10 }}>
        <Text>Email</Text>
        <TextInput
          placeholder="example@email.com"
          value={email}
          setValue={setEmail}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Text>Password</Text>
        <TextInput
          placeholder="****"
          secureTextEntry={true}
          value={password}
          setValue={setPassword}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <View style={{ marginVertical: 5 }}>
          <Button onPress={() => setOpen(false)}>cancel</Button>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Button
            onPress={() =>
              signInHandler({
                action,
                email,
                password,
                setOpen,
                setTimedMessage,
                username,
              })
            }
          >
            sign in
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
