import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const gradientAnimation = useState(new Animated.Value(0))[0];

    // Create animations for each logo
    const iconMovementBottom = useState(new Animated.Value(0))[0]; // Bottom logo
    const iconMovementTop = useState(new Animated.Value(0))[0]; // Top logo
    const iconRotation = useState(new Animated.Value(0))[0]; // Rotating logo

    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();

        // Animated background gradient loop
        Animated.loop(
            Animated.sequence([  
                Animated.timing(gradientAnimation, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: false,
                }),
                Animated.timing(gradientAnimation, {
                    toValue: 0,
                    duration: 5000,
                    useNativeDriver: false,
                }),
            ])
        ).start();

        // 1. Bottom Logo Horizontal Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconMovementBottom, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconMovementBottom, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 2. Top Logo Horizontal Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconMovementTop, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconMovementTop, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 3. Rotation Animation for the last logo
        Animated.loop(
            Animated.timing(iconRotation, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    const animatedBackground = gradientAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 182, 193, 0.6)', 'rgba(255, 105, 180, 0.9)'],
    });

    // Interpolate icon movements
    const iconTranslateXBottom = iconMovementBottom.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300], // Moves from 0 to 300 (horizontal movement for bottom logo)
    });

    const iconTranslateXTop = iconMovementTop.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300], // Moves from 0 to 300 (horizontal movement for top logo)
    });

    const iconRotationValue = iconRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'], // Rotates 360 degrees for the rotation logo
    });

    return (
        <PaperProvider>
            <Animated.View style={[styles.container, { backgroundColor: animatedBackground }]}>
                {/* Icon 1: Center Logo (flower) */}
                <MaterialCommunityIcons name="flower" size={100} color="rgba(255, 255, 255, 0.3)" style={styles.centerIcon} />

                {/* Icon 2: Bottom Logo (leaf) */}
                <Animated.View
                    style={[styles.backgroundIcon, { transform: [{ translateX: iconTranslateXBottom }] }, { bottom: 10 }]}
                >
                    <MaterialCommunityIcons name="leaf" size={100} color="rgba(255, 255, 255, 0.3)" />
                </Animated.View>

                {/* Icon 3: Top Logo (flower-tulip) */}
                <Animated.View
                    style={[styles.backgroundIcon, { transform: [{ translateX: iconTranslateXTop }] }, { top: 10 }]}
                >
                    <MaterialCommunityIcons name="flower-tulip" size={100} color="rgba(255, 255, 255, 0.3)" />
                </Animated.View>

                {/* Icon 4: Rotating Logo (pine-tree) */}
                <Animated.View
                    style={[styles.backgroundIcon, { transform: [{ rotate: iconRotationValue }] }, { right: 0 }]}
                >
                    <MaterialCommunityIcons name="pine-tree" size={100} color="rgba(255, 255, 255, 0.3)" />
                </Animated.View>

                <ThemedView style={styles.innerContainer}>
                    <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={5} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button onPress={() => handleDeleteTodo(item._id)} style={styles.deleteButton}>Delete</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Todo</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Todo" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </Animated.View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        backgroundColor: 'transparent', 
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#white',
        textAlign: 'center',
    },
    backgroundIcon: {
        position: 'absolute',
    },
    centerIcon: {
        alignSelf: 'center',
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        backgroundColor: 'transparent', 
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#FF69B4',
    },
    description: {
        color: '#FF1493',
        fontSize: 16,
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 5,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#FF69B4',
        elevation: 6,
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    input: {
        marginBottom: 12,
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#FF69B4',
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#FFD1DC',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    dialogButton: {
        backgroundColor: '#FF69B4',
        borderRadius: 5,
    },
});

export default TodosScreen;
