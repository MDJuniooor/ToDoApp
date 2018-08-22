import React, { Component } from "react";
import { StyleSheet, Text, View} from "react-native";

export default class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: '',
      minute: '',
      isLoadedTime: false
    };
  }
  componentDidMount() {
    setInterval(() => {
      const date =  new Date();
      this.setState({
        hour: date.getHours(),
        minute : date.getMinutes(),
        isLoadedTime: true
      });
    }, 1000);
  }

  render() {
    let {hour, minute, isLoadedTime} = this.state;
    if (minute < 10){
      minute = '0'+ minute;
    }
    if (hour < 10){
      hour = '0' + hour;
    }
    if (!isLoadedTime) {
      return (<View></View>)
    }
    return (
      <View style={styles.MainContainer}>
        <Text style={styles.TextStyle}> {hour} : {minute} </Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1/2,
    marginLeft: 10,
    marginTop: 20,
  },
  TextStyle: {
    fontSize: 45,
    textAlign: "center",
    color: "white"
  }
});
