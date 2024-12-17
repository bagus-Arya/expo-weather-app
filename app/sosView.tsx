import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Linking, Alert } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function sosView() {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const scaleAnim = useState(new Animated.Value(1))[0]; // Scale animation

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const handleSOSPress = () => {
        if (location) {
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            Linking.openURL(mapUrl).catch(err => console.error("An error occurred", err));
        } else {
            console.log("Location not available");
        }
    };

    const sendData = () => {

        if (location) {

            const lat = location.coords.latitude;
            const lng = location.coords.longitude;

            console.log("Sending SOS with location:", lat +`, `+ lng);
            Alert.alert("Success sending location:", lat +`, `+ lng);
        } else {
            console.log("Location not available");
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.ringContainer}>
                <LinearGradient
                    colors={['#FF5F6D', '#FFC371']} // Gradient colors for the ring
                    style={styles.gradientRing}
                />
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={sendData}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <LinearGradient
                            colors={['#FF5F6D', '#FFC371']} // Gradient colors for the button
                            style={styles.gradient}
                        >
                        <Text style={styles.sosText}>SOS</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
                location && (
                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={handleSOSPress}
                    >
                        <Text style={styles.locationText}>
                            open coordinate : {JSON.stringify(location.coords.latitude)}, {JSON.stringify(location.coords.longitude)}
                        </Text>
                    </TouchableOpacity>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B12323',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
    },
    errorText: {
        color: 'white',
        marginBottom: 20,
    },
    locationText: {
        color: 'white',
    },
    sosButton: {
        width: width * 0.50,
        height: width * 0.50, 
        borderRadius: (width * 0.50) / 2, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    sosText: {
        color: 'white',
        fontSize: width * 0.10,
        fontWeight: 'bold',
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: (width * 0.25) / 2, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringContainer: {
        width: width * 0.50,
        height: width * 0.50, 
        borderRadius: (width * 0.50) / 2, 
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gradientRing: {
        position: 'absolute',
        width: '100%',
        height: '100%', 
        borderRadius: (width * 0.5) / 2,
        borderWidth: 20, 
        borderColor: 'transparent',
    },
});
