import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                username,
                password,
            });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            router.replace("/(tabs)"); 
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            Alert.alert("Login Failed", errorMessage);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Image
                source={require("../../assets/images/favicon1.png")}
                style={styles.logo}
            />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to continue</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#b399c1"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b399c1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push("/auth/RegisterScreen")}
            >
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8e6f4", 
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
        resizeMode: "cover", 
        borderRadius: 60, 
        borderWidth: 2,
        borderColor: "#a85792", 
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#a85792", 
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        color: "#b399c1", 
        textAlign: "center",
    },
    input: {
        width: "90%",
        height: 48,
        borderColor: "#d6a3dc", 
        borderWidth: 1,
        borderRadius: 24, 
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff", 
        fontSize: 16,
        color: "#6a11cb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    loginButton: {
        width: "90%",
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#a85792", 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 16,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
    registerButton: {
        width: "90%",
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff", 
        borderColor: "#a85792",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    registerButtonText: {
        color: "#a85792",
        fontSize: 16,
        fontWeight: "600",
    },
});
