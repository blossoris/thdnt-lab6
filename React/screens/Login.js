import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { authService } from '../Services/authService';
import { COLORS, FONTS, SIZES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155


const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        try {
            const result = await authService.login(username, password);
            if (result.success) {
                await AsyncStorage.setItem('token', result.token);
                await AsyncStorage.setItem('username', username);
                navigation.replace('Tabs');
            } else {
                Alert.alert('Error', result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.lightGray}
                value={username}
                onChangeText={setUsername}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.lightGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding,
        backgroundColor: COLORS.black,
        justifyContent: 'center'
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        marginBottom: SIZES.padding * 2,
        textAlign: 'center'
    },
    input: {
        backgroundColor: COLORS.gray,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        color: COLORS.white
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        alignItems: 'center',
        marginTop: SIZES.padding
    },
    buttonText: {
        ...FONTS.h3,
        color: COLORS.white
    },
    link: {
        ...FONTS.body3,
        color: COLORS.lightGray,
        textAlign: 'center',
        marginTop: SIZES.padding
    }
});

export default Login; 