import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';
import * as ImagePicker from 'expo-image-picker';

type UserProfile = {
    username: string;
    email: string;
    activities: number;
    avatar?: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [image, setImage] = useState<string | null>(null);  // For storing selected image
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    const getBadge = (activities: number) => {
        if (activities >= 50) return 'Gold';
        if (activities >= 20) return 'Silver';
        return 'Bronze';
    };

    const pickImage = async () => {
        // Request permission to access the camera or gallery
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access the camera roll is required!');
            return;
        }

        // Launch image picker and update image state
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
            handleProfileImageChange(pickerResult.assets[0].uri);  // Update immediately after selecting image
        }
    };

    const handleProfileImageChange = async (selectedImageUri: string) => {
        if (selectedImageUri) {
            try {
                const token = await AsyncStorage.getItem('token');
                const formData = new FormData();
                formData.append('avatar', {
                    uri: selectedImageUri,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                });

                await axios.post(`${API_URL}/api/upload-avatar`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // After uploading, update profile picture in state
                setProfile((prevProfile) => (prevProfile ? { ...prevProfile, avatar: selectedImageUri } : prevProfile));
            } catch (error) {
                console.error('Failed to upload profile image', error);
            }
        }
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.contentContainer}>
                    {profile ? (
                        <View style={styles.profileContainer}>
                            <View style={styles.avatarContainer}>
                                <TouchableOpacity onPress={pickImage}>
                                    <Image
                                        source={{ uri: image || profile.avatar || '' }}
                                        style={styles.avatar}
                                    />
                                </TouchableOpacity>
                                <Button mode="text" onPress={pickImage} style={styles.editButton}>
                                    Edit
                                </Button>
                            </View>
                            <View style={styles.header}>
                                <ThemedText style={styles.username}>{profile.username}</ThemedText>
                                <ThemedText style={styles.email}>{profile.email}</ThemedText>
                                <ThemedText style={styles.badge}>{`Badge: ${getBadge(profile.activities)}`}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <ThemedText style={styles.label}>Total Activities</ThemedText>
                                <ThemedText style={styles.value}>{profile.activities}</ThemedText>
                            </View>
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </View>
                    ) : (
                        <ThemedText>No profile data available</ThemedText>
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                                <Button onPress={confirmLogout}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFD1DC',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        borderRadius: 12,
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 150,  // Avatar size
        height: 150,
        borderRadius: 75,  // Circular avatar
        marginBottom: 16,
    },
    editButton: {
        marginLeft: 12,
        backgroundColor: 'transparent',
        color: '#FF69B4',
    },
    username: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 18,
        color: '#666',
        marginTop: 8,
    },
    badge: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6B6B',
        marginTop: 8,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: '#ff5252',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default ProfileScreen;
