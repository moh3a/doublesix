import { useSafeAreaInsets } from "react-native-safe-area-context";

import View from "../components/shared/View";
import Home from "../components/Home";
import { RootTabScreenProps } from "../types";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Home navigation={navigation} />
    </View>
  );
}
