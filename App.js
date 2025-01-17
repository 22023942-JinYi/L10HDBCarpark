import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const App = () => {
    const [mydata, setMyData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [nightParkingFilter, setNightParkingFilter] = useState(false);
    const [freeParkingFilter, setFreeParkingFilter] = useState(false);
    const [searchText, setSearchText] = useState('');

    const url = 'https://data.gov.sg/api/action/datastore_search?resource_id=d_23f946fa557947f93a8043bbef41dd09';

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((myJson) => {
                const records = myJson.result.records;
                setMyData(records);
                setOriginalData(records);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const applyFilters = () => {
        let filteredData = originalData;

    
        if (searchText !== '') {
            filteredData = filteredData.filter(
                (item) =>
                    item.car_park_no.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.address.toLowerCase().includes(searchText.toLowerCase())
            );
        }


        if (nightParkingFilter) {
            filteredData = filteredData.filter(
                (item) => item.night_parking.toLowerCase() === 'yes'
            );
        }

        if (freeParkingFilter) {
            filteredData = filteredData.filter(
                (item) => item.free_parking.toLowerCase() !== 'no'
            );
        }

        setMyData(filteredData);
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const toggleNightParkingFilter = () => {
        setNightParkingFilter(!nightParkingFilter);
    };

    const toggleFreeParkingFilter = () => {
        setFreeParkingFilter(!freeParkingFilter);
    };

    useEffect(() => {
        applyFilters();
    }, [nightParkingFilter, freeParkingFilter, searchText]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.title}>Car Park No: {item.car_park_no}</Text>
                <Text style={styles.text}>Address: {item.address}</Text>
                <Text style={styles.text}>Type: {item.car_park_type}</Text>
                <Text style={styles.text}>Night Parking: {item.night_parking}</Text>
                <Text style={styles.text}>Free Parking: {item.free_parking}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.header}>Search:</Text>
            <TextInput
                style={styles.searchBox}
                placeholder="Enter car park number or address"
                onChangeText={(text) => handleSearchTextChange(text)}
                value={searchText}
            />
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        nightParkingFilter && styles.activeButton,
                    ]}
                    onPress={toggleNightParkingFilter}
                >
                    <Text style={styles.filterText}>Night Parking</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        freeParkingFilter && styles.activeButton,
                    ]}
                    onPress={toggleFreeParkingFilter}
                >
                    <Text style={styles.filterText}>Free Parking</Text>
                </TouchableOpacity>

            </View>
            <FlatList
                data={mydata}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#007BFF',
    },
    filterText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
    },
});

export default App;
