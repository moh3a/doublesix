import { useSafeAreaInsets } from "react-native-safe-area-context";

import View from "../components/shared/View";
import { RootTabScreenProps } from "../types";
import Account from "../components/account/Account";

export default function AccountScreen({
  navigation,
}: RootTabScreenProps<"Account">) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        height: "100%",
        width: "100%",
        display: "flex",
        flex: 1,
        alignItems: "center",
      }}
    >
      <Account navigation={navigation} />
    </View>
  );
}
