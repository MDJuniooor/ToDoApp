import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const weatherCases = {
  Rain: {
    colors: ["#00C6FB", "#005BEA"],
    title: "비",
    subtitle: "Today's weather is Rainy.",
    icon: "weather-rainy"
  },
  Clear: {
    colors: ["#FEF253", "#FF7300"],
    title: "맑음",
    subtitle: "Today's weather is Sunny.",
    icon: "weather-sunny"
  },
  Thunderstorm: {
    colors: ["#00ECBC", "#007ADF"],
    title: "천둥 번개",
    subtitle: "Today's weather is Thunderstorm.",
    icon: "weather-ligthning"
  },
  Clouds: {
    colors: ["#D7D2CC", "#304352"],
    title: "구름 많음",
    subtitle: "Today's weather is Clouds.",
    icon: "weather-cloudy"
  },
  Snow: {
    colors: ["#7DE2FC", "#B9B6E5"],
    title: "눈",
    subtitle: "Today's weather is Snow.",
    icon: "weather-snowy"
  },
  Drizzle: {
    colors: ["#89F7FE", "#66A6FF"],
    title: "이슬비",
    subtitle: "Today's weather is Drizzle.",
    icon: "weather-hail"
  },
  Haze: {
    colors: ["#89F7FE", "#66A6FF"],
    title: "안개",
    subtitle: "Today's weather is Haze.",
    icon: "weather-hail"
  },
  Atmosphere: {
    colors: ["#89F7FE", "#66A6FF"],
    title: "구름 적음",
    subtitle: "Today's weather is Atmosphere.",
    icon: "weather-cloudy"
  },
  Mist: {
    colors: ["#D7D2CC", "#304352"],
    title: "안개",
    subtitle: "Today's weather is Mist.",
    icon: "weather-fog"
  }
};

function Weather({ weatherName, temp }) {
  return (
    <View style={styles.weatherContainer}>
      <MaterialCommunityIcons
        color="white"
        size={32}
        name={weatherCases[weatherName].icon}
      />
      <View style={styles.lower}>
        <Text style={styles.title}>
          {temp}
          &deg;
        </Text>
        <Text style={styles.title}>{weatherCases[weatherName].title}</Text>
      </View>
    </View>
  );
}

Weather.propTypes = {
  temp: PropTypes.number.isRequired,
  weatherName: PropTypes.string.isRequired
};

export default Weather;
const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 10
  },
  lower : {
    flexDirection: "column",
  },
  title: {
    fontSize: 12,
    backgroundColor: "transparent",
    color: "white",
    fontWeight: "100",
    marginLeft: 10
  }
});
