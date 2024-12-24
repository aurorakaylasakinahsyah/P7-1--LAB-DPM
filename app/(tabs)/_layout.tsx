import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'; 

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: () => (
                    <LinearGradient
                        colors={['#F8BBD0', '#F48FB1']} 
                        style={{ flex: 1, borderRadius: 20 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderRadius: 20,
                        marginBottom: 16,
                        marginHorizontal: 8,
                        elevation: 5,
                    },
                    default: {
                        backgroundColor: '#F8BBD0', 
                        borderRadius: 20,
                    },
                }),
                tabBarIcon: ({ focused, color }) => {
                    let IconComponent;
                    let iconName;

                   
                    switch (route.name) {
                        case 'index':
                            IconComponent = Ionicons; 
                            iconName = focused ? 'checkmark-done-circle' : 'checkmark-circle-outline';
                            break;
                        case 'profile':
                            IconComponent = MaterialIcons; 
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        case 'explore':
                            IconComponent = Feather;
                            iconName = focused ? 'map-pin' : 'map';
                            break;
                        default:
                            IconComponent = Ionicons;
                            iconName = 'help-circle';
                    }

                    
                    const scale = new Animated.Value(focused ? 1.2 : 1);
                    Animated.spring(scale, { toValue: focused ? 1.3 : 1, useNativeDriver: true }).start();

                    return (
                        <Animated.View style={{ transform: [{ scale }] }}>
                            <IconComponent name={iconName} size={28} color={color} />
                        </Animated.View>
                    );
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                },
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Todo List', 
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile', 
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore', 
                }}
            />
        </Tabs>
    );
}
