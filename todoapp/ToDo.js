import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
  state = {
    isEditing: false,
    isCompleted: false
  };
  render() {
    const { isCompleted, isEditing } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._toggleComplete}>
          <View
            style={[
              styles.circle,
              isCompleted ? styles.completedCircle : styles.uncompletedCircle
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.text,
            isCompleted ? styles.completedText : styles.uncompletedText
          ]}
        >
          Hello I'm a To Do
        </Text>
        <MaterialCommunityIcons
          style={styles.actions}
          color="black"
          icon="pencil"
          size={40}
        />
        <View style={styles.column}>
          {isEditing ? (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  <MaterialCommunityIcons
                    color="#2F8900"
                    name="check"
                    size={32}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPress={this._startEditing}>
                <View style={styles.actionContainer}>
                  <MaterialCommunityIcons
                    color="black"
                    name="lead-pencil"
                    size={28}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.actionContainer}>
                  <MaterialCommunityIcons
                    color="#F23657"
                    name="close-outline"
                    size={28}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
  _toggleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted
      };
    });
  };
  _startEditing = () => {
    this.setState(prevState => {
      return {
        isEditing: !prevState.isEditing
      };
    });
  };
  _finishEditing = () => {
    this.setState(prevState => {
      return {
        isEditing: !prevState.isEditing
      };
    });
  };
}
const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth, // 밑줄
    flexDirection: "row",
    alignItems: "center", // 아이템 정렬 가운데 있게
    justifyContent: "space-between"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15, // width, height 의 절반!
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20 // 상단 하단 20 씩
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2,
    justifyContent: "space-between"
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  }
});
