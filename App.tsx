import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";

import Navigation from "./src/navigation";
import useColorScheme from "./src/hooks/useColorScheme";
import useCachedResources from "./src/hooks/useCachedResource";
import View from "./src/components/shared/View";
import Text from "./src/components/shared/Text";

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
  "Warning: componentWillReceiveProps has been renamed",
  "Warning: componentWillMount has been renamed, and is not recommended for use",
]);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        {isLoadingComplete ? (
          <>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </>
        ) : (
          <SafeAreaView>
            <View>
              <Text>~ loading ~</Text>
            </View>
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
