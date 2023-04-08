import { useSafeAreaInsets } from "react-native-safe-area-context";

import Text from "../components/shared/Text";
import View from "../components/shared/View";

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        height: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text>~ learn about double six rules ~</Text>
    </View>
  );
}
