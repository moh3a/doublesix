import { StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import { useGame } from "../../hooks/store";
import Text from "../shared/Text";
import View from "../shared/View";

const ScoreBanner = () => {
  const { teamOneScore, teamTwoScore, score } = useGame();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: 5,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
      }}
    >
      <View
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "800" }}>Score</Text>
      </View>
      <View style={{ flex: 6, height: "100%" }}>
        <View style={styles.rounds}>
          {score.map((value, index) => (
            <View
              key={index}
              style={{
                marginHorizontal: 5,
                width: 15,
                height: 15,
                borderRadius: 25,
                backgroundColor: value === 1 ? Colors.side_one : "transparent",
              }}
            />
          ))}
        </View>
        <View style={styles.rounds}>
          {score.map((value, index) => (
            <View
              key={index}
              style={{
                marginHorizontal: 5,
                width: 15,
                height: 15,
                borderRadius: 25,
                backgroundColor: value === 2 ? Colors.side_two : "transparent",
              }}
            />
          ))}
        </View>
      </View>
      <View style={{ flex: 1, height: "100%" }}>
        <Text style={{ textAlign: "center" }}>{teamOneScore}</Text>
        <Text style={{ textAlign: "center" }}>{teamTwoScore}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rounds: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default ScoreBanner;
