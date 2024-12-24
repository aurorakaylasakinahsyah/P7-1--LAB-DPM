import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { ThemedText } from '@/components/ThemedText';
import { Button, Card, Divider } from 'react-native-paper';

const ExploreScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([
        { id: '1', title: 'Sate Maranggi', description: 'Sate khas Purwakarta yang lembut dan kaya rasa.', location: 'Purwakarta, Jawa Barat', rating: 4.8 },
        { id: '2', title: 'Gudeg Yu Djum', description: 'Gudeg Jogja otentik yang manis dan gurih.', location: 'Yogyakarta, Jawa Tengah', rating: 4.7 },
        { id: '3', title: 'Babi Guling Ibu Oka', description: 'Babi guling khas Bali dengan bumbu rempah yang kaya.', location: 'Ubud, Bali', rating: 4.6 },
        { id: '4', title: 'Pempek Vico', description: 'Pempek Palembang dengan rasa autentik dan cuko khas.', location: 'Palembang, Sumatera Selatan', rating: 4.5 },
        { id: '5', title: 'Ayam Betutu Men Tempeh', description: 'Ayam betutu Bali yang pedas dan kaya bumbu.', location: 'Gilimanuk, Bali', rating: 4.6 },
        { id: '6', title: 'Rawon Setan', description: 'Rawon daging sapi khas Surabaya dengan kuah hitam gurih.', location: 'Surabaya, Jawa Timur', rating: 4.7 },
        { id: '7', title: 'Soto Betawi Haji Ma’ruf', description: 'Soto Betawi yang gurih dengan daging empuk.', location: 'Jakarta Pusat, Jakarta', rating: 4.8 },
        { id: '8', title: 'Rendang Mak Yus', description: 'Rendang Padang yang kaya bumbu dan lembut.', location: 'Padang, Sumatera Barat', rating: 4.9 },
        { id: '9', title: 'Bakmi GM', description: 'Bakmi legendaris Jakarta dengan pangsit goreng favorit.', location: 'Jakarta, Jakarta', rating: 4.5 },
        { id: '10', title: 'Ikan Bakar Jimbaran', description: 'Ikan bakar segar khas Bali dengan sambal matah.', location: 'Jimbaran, Bali', rating: 4.7 },
    ]);
    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = () => {
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <LinearGradient
            colors={['#ffe0b2', '#d7ccc8', '#5d4037']} 
            style={styles.gradientBackground}
        >
            <View style={styles.header}>
                <ThemedText style={styles.welcomeText}>Selamat Datang di Jelajah Rasa!</ThemedText>
                <ThemedText style={styles.subText}>
                    Temukan makanan khas Indonesia yang lezat dan unik
                </ThemedText>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari makanan..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#9e9e9e"
                />
                <Button
                    mode="contained"
                    onPress={handleSearch}
                    style={styles.searchButton}
                >
                    Cari
                </Button>
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title title={item.title} />
                        <Divider />
                        <Card.Content>
                            <ThemedText style={styles.descriptionText}>
                                {item.description}
                            </ThemedText>
                            <ThemedText style={styles.locationText}>
                                Lokasi: {item.location}
                            </ThemedText>
                            <ThemedText style={styles.ratingText}>
                                Rating: {item.rating} ★
                            </ThemedText>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>
                        Tidak ada makanan yang ditemukan
                    </ThemedText>
                }
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f', 
    },
    subText: {
        fontSize: 16,
        color: '#5d4037', 
        marginTop: 8,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderColor: '#d32f2f', 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginRight: 8,
    },
    searchButton: {
        backgroundColor: '#d32f2f', 
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#ffe0b2', 
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#5d4037',
    },
    descriptionText: {
        color: '#5d4037',
        fontSize: 14,
        marginTop: 8,
    },
    locationText: {
        color: '#795548',
        fontSize: 14,
        marginTop: 4,
    },
    ratingText: {
        color: '#d32f2f',
        fontSize: 14,
        marginTop: 4,
    },
});

export default ExploreScreen;
