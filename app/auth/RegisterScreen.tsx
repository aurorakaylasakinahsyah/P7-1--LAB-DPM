import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import API_URL from "../../config/config";

export default function RegisterScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const router = useRouter();

	const handleRegister = async () => {
		try {
			await axios.post(`${API_URL}/api/auth/register`, {
				username,
				password,
				email,
			});
			Alert.alert("Registration Successful", "You can now log in");
			router.replace("/auth/LoginScreen");
		} catch (error) {
			Alert.alert("Registration Failed", (error as any).response?.data?.message || "An error occurred");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image
					source={require("../../assets/images/favicon1.png")}
					style={styles.image}
				/>
				<Text style={styles.title}>Create an Account</Text>
				<Text style={styles.subtitle}>Join us with an amazing journey of exploration and growth!</Text>
			</View>

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
				placeholder="Email"
				placeholderTextColor="#b399c1"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
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
				style={styles.registerButton}
				onPress={handleRegister}
			>
				<Text style={styles.registerButtonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => router.replace("/auth/LoginScreen")}
			>
				<Text style={styles.backButtonText}>Back to Login</Text>
			</TouchableOpacity>
		</View>
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
	header: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 32,
		paddingTop: 20,
	},
	image: {
		width: 120,
		height: 120,
		marginBottom: 16,
		borderRadius: 60, 
		borderWidth: 2,
		borderColor: "#a85792",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#a85792",
	},
	subtitle: {
		fontSize: 16,
		color: "#b399c1",
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
	registerButton: {
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
	registerButtonText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "bold",
	},
	backButton: {
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
	backButtonText: {
		color: "#a85792",
		fontSize: 16,
		fontWeight: "600",
	},
});