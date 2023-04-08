import { useSafeAreaInsets } from "react-native-safe-area-context";

import Join from "../components/game/Join";
import View from "../components/shared/View";
import { RootTabScreenProps } from "../types";

export default function JoinScreen({ navigation }: RootTabScreenProps<"Join">) {
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
      <Join navigation={navigation} />
    </View>
  );
}
