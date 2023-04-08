import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps } from "react";

type ThemeProps = {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: string;
};

type IconProps = ThemeProps & ComponentProps<typeof FontAwesome>;

export default function Icon(props: IconProps) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
