import React, { useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, logout } from '@/services/apiAuth';
import { router } from "expo-router";
import { BackHandler } from 'react-native';

// Define the possible weather conditions
type WeatherCondition = 'Cerah' | 'Hujan' | 'Berawan';

interface WeatherData {
  location: string;
  temperature: string;
  condition: WeatherCondition;
  windSpeed: string;
  humidity: string;
  airPressure: string;
}

export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const iconAnimation = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const backAction = () => {
      // Prevent the default back action
      // Returning true prevents the back action
      return true; 
    };

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    getUserData();

    return () => {
      backHandler.remove();
      floatAnimation.stop();
    };
  }, []);
  
  // Sample weather data
  const weatherData: WeatherData = {
    location: 'Denpasar',
    temperature: '25',
    condition: 'Berawan', // Example condition
    windSpeed: '10 km/h',
    humidity: '60%',
    airPressure: '1013 hPa',
  };

  const translateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  // Function to determine the icon based on the condition
  const getWeatherIcon = (condition: WeatherCondition): any => {
    switch (condition) {
      case 'Cerah':
        return require('@/assets/images/tabs/Sun.png'); // Sunny
      case 'Hujan':
        return require('@/assets/images/tabs/Raining.png'); // Rainy
      case 'Berawan':
        return require('@/assets/images/tabs/Thunder.png'); // Cloudy
      default:
        return require('@/assets/images/tabs/Sun.png'); // Default to sunny
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      await AsyncStorage.clear(); // Clear all stored data
      router.replace('/login');
    } catch (error) {
      console.log('Logout error details:', error);
      router.replace('/login');
    } finally {
      // Clear any remaining app state here if needed
    }
  };

  return (
    <ScrollView style={styles.container}>

       {/* User Welcome Section */}
       {user && (
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        <Text style={styles.location}>{weatherData.location}</Text>
        <Animated.Image 
          source={getWeatherIcon(weatherData.condition)} 
          style={[
            styles.icon,
            {
              transform: [{
                translateY: iconAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              }],
            },
          ]} 
          resizeMode="contain" 
        />
        <Text style={styles.temperature}>{weatherData.temperature} °C</Text>
        <Text style={styles.condition}>{weatherData.condition}</Text>

        {/* Weather Details */}
        <View style={styles.weatherRow}>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/angin-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Kecepatan Angin</Text>
            <Text style={styles.weatherDetail}>{weatherData.windSpeed}</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/kelembaban-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Kelembaban</Text>
            <Text style={styles.weatherDetail}>{weatherData.humidity}</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/tekananudara-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Tekanan Udara</Text>
            <Text style={styles.weatherDetail}>{weatherData.airPressure}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Forecast Cards */}
      <ScrollView 
        style={styles.forecastContainer} 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Hari Ini</Text>
          <Text style={styles.forecastTemperature}>27 °C</Text>
          <Text style={styles.forecastCondition}>Cerah</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Senin</Text>
          <Text style={styles.forecastTemperature}>24 °C</Text>
          <Text style={styles.forecastCondition}>Hujan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Selasa</Text>
          <Text style={styles.forecastTemperature}>26 °C</Text>
          <Text style={styles.forecastCondition}>Berawan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Rabu</Text>
          <Text style={styles.forecastTemperature}>27 °C</Text>
          <Text style={styles.forecastCondition}>Cerah</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Kamis</Text>
          <Text style={styles.forecastTemperature}>24 °C</Text>
          <Text style={styles.forecastCondition}>Hujan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Jumat</Text>
          <Text style={styles.forecastTemperature}>26 °C</Text>
          <Text style={styles.forecastCondition}>Berawan</Text>
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>Sabtu</Text>
          <Text style={styles.forecastTemperature}>26 °C</Text>
          <Text style={styles.forecastCondition}>Berawan</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040424',
  },
  card: {
    backgroundColor: '#FA8C2B',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    marginBottom: 20,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  temperature: {
    color: '#FFD700',
    fontSize: 64,
    fontWeight: 'bold',
  },
  condition: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    width: 150,
    height: 150,
  },
  iconSmall:{
    width: 25,
    height: 25,
    marginBottom: 10,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  weatherDetailContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weatherDetail: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
  },
  forecastContainer: {
    flexDirection: 'row', 
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%', 
  },
  forecastCard: {
    backgroundColor: '#FA8C2B',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5, 
    minWidth: 100, 
  },
  forecastText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastTemperature: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
  },
  forecastCondition: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#FA8C2B',
    borderRadius: 15,
    marginBottom: 10,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#FA8C2B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
});