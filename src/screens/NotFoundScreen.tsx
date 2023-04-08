import { useSafeAreaInsets } from "react-native-safe-area-context";

import Text from "../components/shared/Text";
import View from "../components/shared/View";
import { RootStackScreenProps } from "../types";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text>~ 404 ~ NOT FOUND ~</Text>
    </View>
  );
}
