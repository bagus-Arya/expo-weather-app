import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    ImageBackground, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet, 
    Pressable,
    TouchableOpacity,
    BackHandler 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDeviceList, DeviceResponse, DeviceEntry } from '@/services/apiDeviceLists';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon library
import { useRouter } from 'expo-router';
import { User, logout } from '@/services/apiAuth';

interface DeviceDetailProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    value: string | number;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ icon, value }) => (
    <View style={styles.deviceDetailContainer}>
        <MaterialIcons name={icon} size={20} color="#007BFF" />
        <View style={styles.textContainer}>
            <Text style={styles.deviceDetail}>{value}</Text>
        </View>
    </View>
);

const UserDevices = () => {
    const [devices, setDevices] = useState<DeviceEntry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const refreshInterval = 10000; // 10 second
    const router = useRouter();
    const backAction = () => {
        // Prevent the default back action
        // Returning true prevents the back action
        return true; 
    };

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUserId(userData.id);
                } else {
                    throw new Error('User  data not found');
                }
            } catch (err) {
                // console.error('Error retrieving user ID:', err);
                setError('Failed to retrieve user ID');
            }
        };

        getUserId();
    }, []);

    useEffect(() => {
        const getDevices = async () => {
            if (userId === null) return;

            try {
                const deviceData: DeviceResponse = await fetchDeviceList(userId);
                // console.log('Fetched devices:', deviceData);
                setDevices(deviceData.data);
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
            getDevices();
        }, refreshInterval);
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
            clearInterval(intervalId);
        };
    }, [userId]);

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

        getUserData();
      }, []);

    const getCardImage = (suhu: number) => {
        if (suhu < 25) {
            return require('@/assets/images/raining.jpg'); 
        } else if (suhu >= 25 && suhu <= 30) {
            return require('@/assets/images/winter.jpg'); 
        } else {
            return require('@/assets/images/winter.jpg');
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
        
        <View style={styles.container}>

            {/* User Welcome Section */}
            {user && (
                <View style={styles.welcomeContainer}>
                     <View style={styles.header}>
                        <Image 
                            source={require('@/assets/images/EFISTRAC.png')}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.welcomeHeader}>
                        <View>
                            <Text style={styles.welcomeText}>Hi, {user.name}</Text>
                            <Text style={styles.emailText}>{user.email}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                        >
                            <MaterialIcons name='logout' size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {devices && devices.length > 0 ? (
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                    onPress={() => {
                        // const deviceId = String(item.device.id);
                        router.push(`/(tabs)/home/${item.device.id}`)
                    }}
                    style={styles.deviceContainer}
                  >
                    <ImageBackground 
                        source={getCardImage(item.device.logs.suhu)}
                        style={styles.imageBackground}
                        imageStyle={styles.imageStyle}
                    >
                        <Text style={[
                            styles.statusText,
                            item.status === 'online' ? styles.onlineStatus : styles.offlineStatus
                            ]}>
                            {item.status}
                        </Text>
                        <Text style={styles.dateText}>
                            {new Date(item.device.logs.created_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </Text>
                        
                        <View style={styles.deviceInfo}>
                            <DeviceDetail
                                icon='place'
                                value={item.device.place_name}
                            />
                            <DeviceDetail
                                icon='thermostat'
                                value={`${item.device.logs.suhu} °C`}
                            />
                            <DeviceDetail
                                icon='water'
                                value={`${item.device.logs.kelembaban} %`}
                            />
                        </View>
                    </ImageBackground>
                  </Pressable>
                )}
                contentContainerStyle={styles.listContent}
            />
        ) : (
            <Text style={styles.emptyMessage}>No devices available</Text> 
        )}
        </View>
    );
};

// Styles for better presentation
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8', 
        padding: 16,
        paddingTop: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
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
    deviceContainer: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3, 
    },
    deviceCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    imageBackground: {
        width: '110%',
        height: 165,
        justifyContent: 'flex-end', 
        padding: 15, 
    },
    imageStyle: {
        borderRadius: 10,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    onlineStatus: {
        color: 'green',
    },
    offlineStatus: {
        color: 'red',
    },
    emptyMessage:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceDetailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-start',
    },
    deviceDetail: {
      marginLeft: 8,
      fontSize: 16,
      color: '#333',
      textAlign: 'left',
    },
    listContent: {
        paddingBottom: 10,
        backgroundColor: '#f5f5f5'
    },
    textContainer: {
        width: 80,
        alignItems: 'flex-start',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    welcomeContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 10,
      },
      welcomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      logoutButton: {
        backgroundColor: '#040424',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 15,
      },
      welcomeText: {
        color: '#040424',
        fontSize: 24,
        fontWeight: 'bold',
      },
      emailText: {
        color: '#040424',
        fontSize: 16,
        opacity: 0.8,
      },
});

export default UserDevices;