/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Server: {
            screens: {
              ServerScreen: "server",
            },
          },
          Join: {
            screens: {
              JoinScreen: "join",
            },
          },
          Room: {
            screens: {
              RoomScreen: "room",
            },
          },
          Account: {
            screens: {
              AccountScreen: "account",
            },
          },
          Info: {
            screens: {
              InfoScreen: "info",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
