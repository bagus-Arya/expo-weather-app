import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDeviceList, DeviceResponse } from '@/services/apiDeviceLists';
import { MaterialIcons } from '@expo/vector-icons'; // Import the icon library
import { useRouter } from 'expo-router';

interface DeviceDetailProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    value: string | number;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ icon, value }) => (
    <View style={styles.deviceDetailContainer}>
        <MaterialIcons name={icon} size={20} color="#007BFF" />
        <Text style={styles.deviceDetail}>{value}</Text>
    </View>
);

const UserDevices = () => {
    const [devices, setDevices] = useState<DeviceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [machineId, setMachineId] = useState<number>(2);
    const router = useRouter();

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
                console.error('Error retrieving user ID:', err);
                setError('Failed to retrieve user ID');
            }
        };

        getUserId();
    }, []);

    useEffect(() => {
        const getDevices = async () => {
            if (userId === null) return;
            try {
                const deviceData = await fetchDeviceList(userId, machineId);
                setDevices(deviceData);
            } catch (err) {
                console.error('Error fetching devices:', err);
                if (err instanceof Error) {
                    setError(`Failed to fetch devices: ${err.message}`);
                } else {
                    setError('Failed to fetch devices: Unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };
        getDevices();
    }, [userId, machineId]);

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
            <View style={styles.header}>
                <Image 
                    source={require('@/assets/images/EFISTRAC.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>My Devices</Text>
            </View>
            
            <FlatList
                data={devices ? [devices] : []}
                keyExtractor={item => item.data.id.toString()}
                renderItem={({ item }) => (
                    <Pressable 
                        style={styles.deviceCard}
                        onPress={() => router.push('/(tabs)/home')}
                    >
                        <Text style={[
                                styles.statusText,
                                item.status === 'online' ? styles.onlineStatus : styles.offlineStatus
                            ]}>
                                {item.status}
                        </Text>
                        <View style={styles.deviceInfo}>
                            <DeviceDetail 
                                icon="place" 
                                value={item.data.device.place_name} 
                            />
                            <DeviceDetail 
                                icon="thermostat" 
                                value={`${item.data.device.suhu}°C`} 
                            />
                            <DeviceDetail 
                                icon="water" 
                                value={`${item.data.device.kelembaban}%`} 
                            />
                        </View>
                    </Pressable>
                )}
                contentContainerStyle={styles.listContent}
            />

        </View>
    );
};

// Styles for better presentation
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8', // Light background color
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333', // Darker text color
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
    deviceCard: {
        backgroundColor: '#ffffff', // White card background
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deviceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceDetailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    deviceDetail: {
      marginLeft: 8,
      fontSize: 16,
      color: '#555',
    },
    listContent: {
        paddingBottom: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 20,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize'
    },
    onlineStatus: {
        color: '#34C759' // Apple's system green
    },
    offlineStatus: {
        color: '#FF3B30' // Apple's system red
    }
});

export default UserDevices;