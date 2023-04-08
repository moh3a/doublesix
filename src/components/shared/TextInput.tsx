import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TextInput as DefaultTextInput } from "react-native";

import Colors from "../../constants/Colors";
import View from "./View";

type ThemeTextInput = {
  placeholder: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  condition?: boolean;
};

type TextInputProps = ThemeTextInput & DefaultTextInput["props"];

const TextInput = ({
  placeholder,
  value,
  setValue,
  condition,
}: TextInputProps) => {
  return (
    <View style={styles.container}>
      <DefaultTextInput
        style={{
          paddingHorizontal: 15,
          paddingVertical: 2,
          borderRadius: 5,
          backgroundColor: Colors.white,
          color: Colors.black,
          ...(condition
            ? {
                borderColor: Colors.red,
                borderWidth: 2,
              }
            : {
                borderColor: Colors.black,
                borderWidth: 1,
              }),
        }}
        placeholder={placeholder}
        placeholderTextColor={"#999"}
        value={value}
        onChangeText={(e) => setValue && setValue(e)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginVertical: 4,
  },
});

export default TextInput;
