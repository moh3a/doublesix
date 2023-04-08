import { TouchableOpacity } from "react-native";
import { ReactNode } from "react";

import Colors from "../../constants/Colors";
import Text from "./Text";

type ThemedProps = {
  children: ReactNode;
  disabled?: boolean;
};
export type ButtonProps = ThemedProps & TouchableOpacity["props"];

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={{
        backgroundColor: props.disabled ? Colors.gray : Colors.primary,
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
      {...props}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: Colors.white,
          textAlign: "center",
        }}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

/**
 <LinearGradient
      style={{
        borderRadius: 5,
      }}
      key={props.testID}
      start={{ x: 0, y: 1 }}
      colors={
        props.disabled
          ? [Colors.gray, Colors.gray]
          : [Colors.side_two, Colors.side_one]
      }
    >
    </LinearGradient>
 */
