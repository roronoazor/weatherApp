import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";


class ForeCast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.bigText}>
                    {this.props.main}
                </Text>
                <Text style={styles.mainText}>
                    Current conditions: {this.props.description}
                </Text>
                <Text style={styles.bigText}>
                    {this.props.temp}°F
                </Text>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: { height: 130 },
    bigText: {
        flex: 2,
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        color: "#000"
    },
    mainText: { flex: 1, fontSize: 15, textAlign: "center", color: "#000" }
});


export default ForeCast;