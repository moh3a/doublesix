import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  doc,
  onSnapshot,
  query,
  where,
  collection,
  setDoc,
} from "firebase/firestore";
import { SvgUri } from "react-native-svg";

import {
  RootTabParamList,
  RootTabScreenProps,
  IHand,
  IGame,
  IRound,
} from "../types";
import Colors from "../constants/Colors";
import HomeScreen from "../screens/Homescreen";
import InfoScreen from "../screens/Infoscreen";
import ServerScreen from "../screens/Serverscreen";
import RoomScreen from "../screens/Roomscreen";
import AccountScreen from "../screens/Accountscreen";
import JoinScreen from "../screens/Joinscreen";
import Icon from "../components/shared/Icon";
import View from "../components/shared/View";
import { auth, db } from "../config/firebase.config";
import { generateToken } from "../lib/helpers";
import {
  useAction,
  useGame,
  useHand,
  useMessage,
  usePlayers,
  useRound,
} from "../hooks/store";
import {
  gamesOnSnapshotHandler,
  roundsOnSnapshotHandler,
} from "../hooks/handlers";

const Stack = createNativeStackNavigator<RootTabParamList>();

function RootTabNavigator(
  { navigation }: any /*RootStackScreenProps<'Root'>*/
) {
  const {
    id: gameId,
    rounds,
    teamOnePlayers,
    teamTwoPlayers,
    updateGame,
    resetGame,
  } = useGame();
  const {
    id: roundId,
    status,
    setRoundId,
    updateRound,
    resetRound,
  } = useRound();
  const { players, getPlayers, updatePlayers, resetPlayers } = usePlayers();
  const { playerId, hand, updateHand, resetHand } = useHand();
  const { setTimedMessage } = useMessage();
  const { setAction, resetActions } = useAction();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const generatedName = "Anonym" + generateToken(10);
        const userRef = doc(db, "users", user.uid);
        const data = {
          id: user.uid,
          name: user.isAnonymous ? generatedName : user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.isAnonymous
            ? `https://avatars.dicebear.com/api/bottts/${generatedName}.svg`
            : user.photoURL,
          isAnonymous: user.isAnonymous,
        };
        if (user.isAnonymous)
          await updateProfile(user, {
            displayName: generatedName,
          });
        await setDoc(userRef, data, { merge: true });
      }
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, db]);

  useEffect(() => {
    if (gameId) {
      const unsub = onSnapshot(
        doc(db, "games", gameId),
        (doc) => {
          if (doc.exists() && gameId && auth.currentUser) {
            let data = { ...doc.data(), id: doc.id } as IGame;
            gamesOnSnapshotHandler({
              data,
              getPlayers,
              navigation,
              resetActions,
              resetGame,
              resetHand,
              resetPlayers,
              resetRound,
              setAction,
              setRoundId,
              setTimedMessage,
              updateGame,
              updatePlayers,
            });
          }
        },
        (error) => console.log(error)
      );
      return () => {
        unsub();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, gameId]);

  useEffect(() => {
    if (roundId) {
      const unsub = onSnapshot(
        doc(db, "rounds", roundId),
        async (doc) => {
          if (auth.currentUser && doc.exists()) {
            const data = { ...doc.data(), id: doc.id } as IRound;
            await roundsOnSnapshotHandler({
              data,
              gameId,
              hand,
              playerId,
              players,
              roundId,
              rounds,
              status,
              teamOnePlayers,
              teamTwoPlayers,
              updateRound,
            });
          }
        },
        (error) => console.log(error)
      );
      return () => {
        unsub();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, roundId]);

  useEffect(() => {
    if (roundId) {
      const unsub = onSnapshot(
        query(collection(db, "hands"), where("roundId", "==", roundId)),
        (querySnap) => {
          if (querySnap.size === 4) {
            querySnap.forEach((doc) => {
              if (auth.currentUser && doc.id === auth.currentUser.uid) {
                updateHand(doc.data() as IHand);
              }
            });
          }
        },
        (error) => console.log(error)
      );
      return () => {
        unsub();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, db]);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "",
          orientation: "portrait",
          headerShadowVisible: false,
          headerLeft() {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Account")}
                >
                  {auth.currentUser && auth.currentUser.photoURL ? (
                    <SvgUri
                      uri={auth.currentUser.photoURL}
                      width={40}
                      height={40}
                      style={{ borderRadius: 25 }}
                    />
                  ) : (
                    <Icon name="user-o" color={Colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            );
          },
          headerRight() {
            return (
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("Info")}>
                  <Icon name="question" color={Colors.primary} />
                </TouchableOpacity>
              </View>
            );
          },
          statusBarTranslucent: true,
        })}
      />
      <Stack.Screen
        name="Server"
        component={ServerScreen}
        options={({ navigation }: RootTabScreenProps<"Server">) => ({
          title: "Lobby",
          orientation: "portrait",
          headerTitleAlign: "center",
          headerShown: false,
          statusBarTranslucent: true,
        })}
      />
      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={({ navigation }: RootTabScreenProps<"Join">) => ({
          title: "Join a server",
          orientation: "portrait",
          headerShown: false,
          statusBarTranslucent: true,
        })}
      />
      <Stack.Screen
        name="Room"
        component={RoomScreen}
        options={({ navigation }: RootTabScreenProps<"Room">) => ({
          title: "Double Six",
          orientation: "portrait",
          headerTitleAlign: "center",
          headerShown: false,
          statusBarHidden: false,
          // statusBarTranslucent: true,
        })}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={({ navigation }: RootTabScreenProps<"Account">) => ({
          title: "Account",
          orientation: "portrait",
          headerTitleAlign: "center",
          headerTransparent: false,
          headerShadowVisible: false,
          statusBarTranslucent: true,
        })}
      />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={({ navigation }: RootTabScreenProps<"Info">) => ({
          title: "Info",
          orientation: "portrait",
          headerTitleAlign: "center",
          headerTransparent: false,
          headerShadowVisible: false,
          statusBarTranslucent: true,
        })}
      />
    </Stack.Navigator>
  );
}

export default RootTabNavigator;
