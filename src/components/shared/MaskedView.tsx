import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import DefaultMaskedView from "@react-native-masked-view/masked-view";

import Colors from "../../constants/Colors";
import View from "./View";
import Text from "./Text";

interface MaskedViewProps {
  text: string;
  children: ReactNode;
}

const MaskedView = ({ children, text }: MaskedViewProps) => (
  <DefaultMaskedView
    style={styles.maskedView}
    maskElement={
      <View style={styles.maskElementView}>
        <Text style={styles.maskElementText}>{text}</Text>
      </View>
    }
  >
    {children}
  </DefaultMaskedView>
);

const styles = StyleSheet.create({
  maskedView: {
    flex: 1,
  },
  maskElementView: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  maskElementText: {
    color: Colors.black,
    fontSize: 60,
    fontWeight: "bold",
  },
});

export default MaskedView;
