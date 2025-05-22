import Home from './Home';
import { BookDetail } from './BookDetail';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155
const Search = () => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black }}>
            <Text style={{ color: COLORS.white }}>Search Screen</Text>
        </View>
    );
};

const Notification = () => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black }}>
            <Text style={{ color: COLORS.white }}>Notification Screen</Text>
        </View>
    );
};

const Setting = ({ navigation }) => {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: COLORS.white, marginBottom: 30 }}>Setting Screen</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export {
    Home,
    Search,
    Notification,
    Setting,
    BookDetail
};