import React, { useRef, useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  Animated, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchDeviceLatest,DevicePredict,PredictedWeather } from '@/services/apiExSmoth';

type Params = {
  deviceId: number; 
};

export default function Home() {

  const scrollY = useRef(new Animated.Value(0)).current;
  const iconAnimation = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState<string | null>(null);
  const [deviceData, setDeviceData] = useState<DevicePredict | null>(null);
  const [predictedWeather, setPredictedWeather] = useState<PredictedWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const refreshInterval = 10000; // 10 second

  // const deviceId = String(item.device.id);
  const router = useRouter();
  const params = useLocalSearchParams();
  const deviceId = params?.deviceId;

  useEffect(() => {
    console.log('Current machineId:', deviceId);
  }, [deviceId]);

  useEffect(() => {
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
 
    return () => {
      floatAnimation.stop();
    };
  }, []);

  useEffect(() => {
    const getDeviceList = async () => {

      if (deviceId === undefined) return;
      
      const idToStore = Array.isArray(deviceId) ? deviceId[0] : deviceId;
      await AsyncStorage.setItem('machineId', idToStore);

      try {
          const deviceData: DevicePredict = await fetchDeviceLatest(Number(deviceId));
          // console.log('Fetched predict home:', deviceData);
          setDeviceData(deviceData);
          setPredictedWeather(deviceData.data);
      } catch (err) {
          // console.error('Error fetching devices:', err);
          if (err instanceof Error) {
              setError(`Failed to fetch devices: ${err.message}`);
          } else {
              setError('Failed to fetch devices: Unknown error occurred.');
          }
      } finally {
          setLoading(false);
      }
    };

    const intervalId = setInterval(() => {
      getDeviceList();
    }, refreshInterval);

    return () => {
        clearInterval(intervalId);
    };

  }, [deviceId]);

  const translateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  // Function to determine the icon based on the condition
  const getWeatherIcon = (condition: string): any => {
    switch (condition) {
      case 'Kondisi Cuaca Baik':
        return require('@/assets/images/tabs/Sun.png'); // Sunny
      case 'Kondisi Cuaca Buruk':
        return require('@/assets/images/tabs/Raining.png'); // Rainy
      case 'Kondisi Tidak Diketahui':
        return require('@/assets/images/tabs/Thunder.png'); // Cloudy
      default:
        return require('@/assets/images/tabs/Sun.png'); // Default to sunny
    }
  };

  const createdAt = deviceData?.latest.created_at;
  
  let formattedDate;

  try {
      if (createdAt) {
        const modifiedDateString = createdAt.replace(/(\.\d{3})\d+Z$/, '$1Z');
          formattedDate = new Date(modifiedDateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
      } else {
        formattedDate = 'Date not available';
      }
  } catch (error) {
      console.error('Error creating date:', error);
      formattedDate = 'Invalid date format';
  }

  if (loading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
    );
  }

  if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeContainer}>
          <TouchableOpacity 
            onPress={() => router.push('/userDevices')}
            style={styles.backButton} 
          >
            <MaterialIcons name='arrow-back' size={30} color="#fff" />
            <Text
              style={styles.backText}
            >
              Kembali
            </Text>
          </TouchableOpacity>
      </View>

      <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
        <Text style={styles.location}>{deviceData?.latest.device.place_name}</Text>
        <Animated.Image 
          source={getWeatherIcon("Kondisi Cuaca Buruk")} 
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
        <Text style={styles.temperature}>{deviceData?.latest.suhu} °C</Text>
        <Text style={styles.condition}>
          {formattedDate}
        </Text>

        {/* Weather Details */}
        <View style={styles.weatherRow}>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/angin-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Kecepatan Angin</Text>
            <Text style={styles.weatherDetail}>{deviceData?.latest.kecepatan_angin} km/h</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/kelembaban-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Kelembaban</Text>
            <Text style={styles.weatherDetail}>{deviceData?.latest.kelembaban} %</Text>
          </View>
          <View style={styles.weatherDetailContainer}>
            <Image 
              source={require('@/assets/images/tabs/tekananudara-icon.png')} 
              style={styles.iconSmall} 
              resizeMode="contain" 
            />
            <Text style={styles.weatherText}>Tekanan Udara</Text>
            <Text style={styles.weatherDetail}>{deviceData?.latest.kecepatan_angin} hPa</Text>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Forecast Cards */}
      <ScrollView 
        style={styles.forecastContainer} 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        {predictedWeather.slice(0, 3).map((weather, index) => {
          const temperatureData = predictedWeather.find(item => item.date === weather.date && item.predicted_suhu !== undefined);
          const conditionData = predictedWeather.find(item => item.date === weather.date && item.condition !== undefined);
          
          return (
              <View key={index} style={styles.forecastCard}>
                  <Text style={styles.forecastText}>{new Date(weather.date).toLocaleDateString(undefined,{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</Text>
                  <Text style={styles.forecastTemperature}>{temperatureData ? temperatureData.predicted_suhu : 'N/A'} °C</Text>
                  <Text style={styles.forecastCondition}>{conditionData ? conditionData.condition : 'Kondisi Tidak Diketahui'}</Text>
              </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );


}const styles = StyleSheet.create({  container: {    flex: 1,
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
    fontSize: 20,
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
    marginBottom: 20,
  },
  forecastText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  forecastTemperature: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
  },
  forecastCondition: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#FA8C2B',
    borderRadius: 15,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#FA8C2B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent : 'center',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 18,
      color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
},
});