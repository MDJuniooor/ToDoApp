import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
  ImageBackground
} from "react-native";
import { AppLoading } from "expo";
import HTML from "react-native-render-html";
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";
import Weather from "./Weather";
import Time from "./Time";

const API_KEY = "348d898faa3b0d6db306ea6c58b7f816";
const { width, height } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {},
    isLoadedWeatherApi: false,
    isLoadedQuote: false,
    erorr: null,
    temperature: null,
    name: null,
    quote_title: null,
    quote_content: null
  };
  componentDidMount = () => {
    this._loadToDos();
    this._getQuote();
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  };
  _getWeather = (lat, long) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          name: json.weather[0].main,
          isLoadedWeatherApi: true
        });
      });
  };
  _getQuote = async () => {
    const response = await fetch(
      "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=rand"
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          quote_title: json[0].title,
          quote_content: json[0].content,
          isLoadedQuote: true
        });
        console.log(this.state.quote_content);
      });
  };
  render() {
    const {
      newToDo,
      loadedToDos,
      toDos,
      isLoadedWeatherApi,
      isLoadedQuote,
      error,
      temperature,
      name,
      quote_content,
      quote_title
    } = this.state;

    if (!loadedToDos || !isLoadedWeatherApi || !isLoadedQuote) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ImageBackground
          style={styles.imageBackground}
          source={require("./assets/back3.jpg")}
        >
          {isLoadedWeatherApi ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
            >
              <Weather
                weatherName={name}
                temp={Math.floor(temperature - 273.15)}
              />
              <View style={styles.greeting}>
                <Text style={styles.greetingText}> Hello, react!</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loading}>
              <Text style={styles.loadingText}>
                날씨 정보 불러오는 중입니다.
              </Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}
          <Time />
          <View style={styles.quotocard}>
            <ScrollView contentContainerStyle={styles.quote}>
              <HTML
                baseFontStyle={{ fontSize: 14, color: "white" }}
                html={"<p>" + quote_content + "</p>"}
              />
            </ScrollView>
          </View>
          <Text style={styles.quoteText}>{quote_title}</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder={"  새로운 할 일 추가"}
              value={newToDo}
              onChangeText={this._contollNewToDo}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              onSubmitEditing={this._addToDo}
              underlineColorAndroid={"transparent"}
            />
            <ScrollView contentContainerStyle={styles.toDos}>
              {Object.values(toDos)
                .reverse()
                .map(toDo => (
                  <ToDo
                    key={toDo.id}
                    deleteToDo={this._deleteToDo}
                    uncompletedToDo={this._uncompletedToDo}
                    completedToDo={this._completedToDo}
                    updateToDo={this._updateToDo}
                    {...toDo}
                  />
                ))}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
  _contollNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      let parsedToDos = {};
      if (toDos !== null) {
        parsedToDos = JSON.parse(toDos);
      }
      this.setState({ loadedToDos: true, toDos: parsedToDos });
    } catch (err) {
      console.log(err);
    }
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _uncompletedToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _completedToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos)); // strings 저장용
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3FA9F5",
    alignItems: "center"
  },
  imageBackground: {
    flex: 1,
    alignSelf: "center",
    height: height,
    width: width,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    color: "red",
    backgroundColor: "transparent",
    marginBottom: 40
  },
  loading: {
    flex: 1,
    backgroundColor: "#3FA9F5",
    justifyContent: "flex-end",
    paddingRight: 25
  },
  loadingText: {
    fontSize: 38,
    marginBottom: 100
  },
  greeting: {
    flex: 1,
    marginTop: 30,
    marginRight: 10,
    alignItems: "flex-end"
  },
  greetingText: {
    fontSize: 18,
    color: "white"
  },
  quoteText: {
    color: "white",
    fontSize: 10
  },
  quote: {
    marginRight: 20,
    marginLeft: 20,
    alignItems: "center",
    height: height / 6
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 4,
    width: width - 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  quotocard: {
    flex: 1,
    width: width - 25,
    marginTop: -20
  },
  input: {
    padding: 10,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 15
  },
  toDos: {
    alignItems: "center"
  }
});
