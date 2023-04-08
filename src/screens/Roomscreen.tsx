import Canvas from "../components/round/Canvas";
import View from "../components/shared/View";
import { RootTabScreenProps } from "../types";

export default function RoomScreen({ navigation }: RootTabScreenProps<"Room">) {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      <Canvas navigation={navigation} />
    </View>
  );
}
