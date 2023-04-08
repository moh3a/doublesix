import { ColorSchemeName } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import RootTabNavigator from "../navigation/RootTabNavigator";
import LinkingConfiguration from "../navigation/LinkingConfiguration";
import Colors from "../constants/Colors";
import { useAction, useMessage } from "../hooks/store";
import Toast from "react-native-root-toast";
import Modal from "../components/shared/Modal";
import View from "../components/shared/View";
import Text from "../components/shared/Text";
import Button from "../components/shared/Button";
import Icon from "../components/shared/Icon";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { prompt, actions } = useAction();
  const { text, type } = useMessage();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
      <Toast
        visible={typeof type !== "undefined" && typeof text !== "undefined"}
        backgroundColor={
          type === "success"
            ? Colors.green
            : type === "warning"
            ? Colors.yellow
            : type === "error"
            ? Colors.red
            : Colors.black
        }
        hideOnPress={true}
        shadow={true}
        shadowColor={
          type === "success"
            ? Colors.green
            : type === "warning"
            ? Colors.yellow
            : type === "error"
            ? Colors.red
            : Colors.black
        }
        opacity={0.8}
        style={{
          borderRadius: 5,
          display:
            typeof type !== "undefined" && typeof text !== "undefined"
              ? "flex"
              : "none",
        }}
        textColor={Colors.white}
        textStyle={{ textAlign: "center", fontWeight: "800" }}
      >
        <Icon
          color={Colors.white}
          size={18}
          name={
            type === "success"
              ? "check-circle"
              : type === "warning"
              ? "exclamation-triangle"
              : type === "error"
              ? "ban"
              : "info-circle"
          }
        />{" "}
        {text}
      </Toast>
      {prompt && actions && (
        <Modal open={prompt ? true : false}>
          <View style={{ margin: 10 }}>
            <Text style={{ marginVertical: 20 }}>{prompt}</Text>
            {actions.map((action, index) => (
              <View key={index} style={{ marginVertical: 5 }}>
                <Button onPress={action.handler}>{action.title}</Button>
              </View>
            ))}
          </View>
        </Modal>
      )}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={RootTabNavigator}
        options={{
          headerShown: false,
          statusBarColor: Colors.primary,
        }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{
          title: "Oops!",
          headerShadowVisible: false,
          statusBarColor: Colors.red,
          statusBarTranslucent: true,
        }}
      />
    </Stack.Navigator>
  );
}
