import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";


export const API_KEY = "16a66fa0b5bf886855dd35850baf3a5d";
export const WEATHER_API = "http://api.openweathermap.org/data/2.5/forecast?";
export const sub_url = "https://api.randomuser.me/?nat=US&results=5";


export const getForeCast = (code) => {
        
        const zip = code;
        const url_string = `${WEATHER_API}q=${zip}&units=imperial&APPID=${API_KEY}`;
        console.log(url_string);
        return fetch(url_string)
            .then((response) => {
                    if(response.ok){
                        return response.json();
                    }
                        throw new Error("response failed");
                }).then(responseJSON => {
                return {
                    main: responseJSON.list[0].weather[0].main,
                    description: responseJSON.list[0].weather[0].description,
                    temp: responseJSON.list[0].main.temp
                    };
            })
            .catch(error => {
                console.error(error);
            });

    }