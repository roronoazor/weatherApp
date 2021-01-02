import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import ForeCast from "./ForeCast";
import {getForeCast, WEATHER_API, API_KEY} from "./api_requests/api_get_forecast";
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {AsyncStorage} from '@react-native-community/async-storage';


class WeatherComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { zip: "" ,
                   forecast: true,
                   latitude: null,
                   longitude: null, 
                   city: null,
                   country: null,
                   location_based: false,
                   photoSource: null,
                   hasPermission: null
      };
    this._handleTextChange = this._handleTextChange.bind(this);
    this.STORAGE_KEY = "@ugoWeather:zip";
    }

    async componentDidMount(){
      this.getPermissionAsync(); // this gets permissions for access to camera
      if (Platform.OS !== "web"){  // async storage not supported on web so for web we use local storage
      AsyncStorage.getItem(this.STORAGE_KEY) 
          .then((value) => {
          if (value !== null) {
            console.log("value", value);
          }else{
            console.log("no value to get");
          }
          })
          .catch((error) => console.log('AsyncStorage error: ' + error.message))
          .done();
      }else{
        localStorage.setItem("name", "jim rohn"); // set data in local storage
        let key_data = localStorage.getItem("name"); // get data in local storage
        if (key_data !== null) {
          console.log("value", key_data);
        }else{
          console.log("noo value to get");
        }
      }
    }

    getPermissionAsync = async () => {
      // Camera roll Permission 
      if (Platform.OS === 'ios') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
      // Camera Permission
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasPermission: status === 'granted' });
    }

    _handleTextChange(event){
      this.setState({...this.state, zip: event.nativeEvent.text}, ()=>{console.log("this state must change: ", this.state)});
      let forecast_data = getForeCast(event.nativeEvent.text).then(mine=>{
        this.setState({...this.state, forecast: mine, location_based: false})
      });
      this.zipInput.clear();

    }

    getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
          initialPosition => {
            this.setState({...this.state, latitude: initialPosition.coords.latitude,
               longitude: initialPosition.coords.longitude
               });
            // if the latitude and longitude returned successfully, we can now get the weather by calling another function
            if (!this.state.latitude || this.state.longitude){
              this.getForecastForCoords(this.state.latitude, this.state.longitude)
            }else{
              alert("could not determine users location")
            }
          },
          error => {
              alert(error.message);
          },
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
   }

   getForecastForCoords = (lat, lon) => {
      let weather_url = `${WEATHER_API}lat=${lat}&lon=${lon}&units=imperial&APPID=${API_KEY}`;
      fetch(weather_url).then((response)=>{
        if (response.ok){
          return response.json()
        }else{
          throw new Error("failed to return response datat")
        }
      }
      ).then((responseJson)=>{
        console.log("responsejons: ", responseJson);
        this.setState({...this.state,
                      city: responseJson.city.name,
                      country: responseJson.city.country,
                      location_based: true,
                      forecast: {
                              main: responseJson.list[0].weather[0].main,
                              description: responseJson.list[0].weather[0].description,
                              temp: responseJson.list[0].main.temp
            }
          })
      }).catch((error)=>{
        // handle errors at this point
        alert(error.message)
      })
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log(result);
    console.log("uri: ", result.uri);
    this.setState({...this.state, photoSource: {uri: result.uri}})
  }

    render(){
        let content = null;
        if (this.state.forecast !== null){
          content = (
            <ForeCast main={this.state.forecast.main}
                      description={this.state.forecast.description}
                      temp={this.state.forecast.temp}
            />
          )
        }

        // depending on which inpu was provided, you render accordingly
        if (this.state.location_based){
          return (
            <View style={styles.container}>
              <ImageBackground source={this.state.photoSource ? this.state.photoSource : require("../assets/android_image_2.png")} resizeMode='cover' style={styles.backdrop}>
              <Text style={{textAlign:"center", marginTop: "30%", marginBottom:"5%"}}>Predict your weather, whichever city you are </Text>
              <TouchableOpacity
                    style={styles.locationButton}
                    onPress={()=>this.getCurrentLocation()}
                  >
                    <Text>use current location</Text>
              </TouchableOpacity>
              <Text style={{textAlign:"center", marginBottom:"2%"}}>You can also enter your zip code below: </Text>
              <TextInput 
              style={styles.input}
              onSubmitEditing={this._handleTextChange}
              ref={zoro=>{this.zipInput=zoro}} 
              />
              {content}
              <Text style={{textAlign:"center"}}>Your current location's info is below: </Text>
              <Text style={{textAlign:"center"}}>Your city: {this.state.city}, Your Country: {this.state.country}</Text>
              <TouchableOpacity
                    style={styles.locationButton}
                    onPress={()=>this.pickImage()}
                  >
                    <Text>Change Background Image</Text>
              </TouchableOpacity>
              <StatusBar style="auto" />
              </ImageBackground> 
            </View>
          );  
        }else{
          return (
              <View style={styles.container}>
                <ImageBackground source={this.state.photoSource ? this.state.photoSource : require("../assets/android_image_2.png")} resizeMode='cover' style={styles.backdrop}>
                <Text style={{textAlign:"center", marginTop: "30%", marginBottom:"5%"}}>Predict your weather, whichever city you are </Text>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={()=>this.getCurrentLocation()}
                  >
                    <Text>use current location</Text>
                  </TouchableOpacity>
                <Text style={{textAlign:"center", marginBottom:"2%"}}>You can also enter your zip code below: </Text>
                <TextInput 
                style={styles.input}
                onSubmitEditing={this._handleTextChange}
                ref={zoro=>{this.zipInput=zoro}} 
                />
                {content}
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={()=>this.pickImage()}
                  >
                    <Text>Change Background Image</Text>
              </TouchableOpacity>
                <Text style={{textAlign:"center"}}>Your input was: {this.state.zip}</Text>
                <StatusBar style="auto" />
                </ImageBackground> 
              </View>
            );  
        }    
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#666666",
    width: "100%"
  },
  input: {
    fontSize: 20,
    borderWidth: 2,
    padding: 2,
    height: 40,
    width: "90%",
    justifyContent: 'center',
    marginLeft: "5%",
    marginRight: "5%",
    textAlign: "center"
    },
  backdrop: {
    flex: 1,
    flexDirection: 'column',
    width: "100%"
    },
  locationButton: {
    backgroundColor: "#82b1ff",
    alignItems: "center",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    marginLeft: "5%",
    marginRight: "5%",
    borderRadius: 5
  }
});


export default WeatherComponent;