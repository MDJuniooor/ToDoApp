import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import PropTypes from "prop-types";
const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, toDoValue: props.text };
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    uncompletedToDo: PropTypes.func.isRequired,
    completedToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired
  };
  state = {
    isEditing: false,
    toDoValue: ""
  };
  render() {
    const { isEditing, toDoValue } = this.state;
    const { text, id, deleteToDo, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle
              ]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText
              ]}
              value={toDoValue}
              multiline={true}
              onChangeText={this._controllInput}
              returnKeyType={"done"}
              onBlur={this._finishEditing}
            />
          ) : (
            <Text
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText
              ]}
            >
              {text}
            </Text>
          )}
        </View>
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
            <TouchableOpacity
              onPressOut={event => {
                event.stopPropagation;
                deleteToDo(id);
              }}
            >
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
    );
  }
  _toggleComplete = event => {
    event.stopPropagation();
    const { isCompleted, uncompletedToDo, completedToDo, id } = this.props;
    if (isCompleted) {
      uncompletedToDo(id);
    } else {
      completedToDo(id);
    }
  };
  _startEditing = event => {
    event.stopPropagation();
    const { text } = this.props;
    this.setState(prevState => {
      return {
        isEditing: !prevState.isEditing,
        toDoValue: text
      };
    });
  };
  _finishEditing = event => {
    event.stopPropagation();
    const { toDoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, toDoValue);
    this.setState(prevState => {
      return { isEditing: false };
    });
  };
  _controllInput = text => {
    this.setState({ toDoValue: text });
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
    borderColor: "#3FA9F5"
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
    width: width / 2
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 15,
    width: width / 2
  }
});
