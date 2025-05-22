import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { COLORS, FONTS, SIZES } from '../constants';
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.20.22:5021/api/auth/register', {
                username,
                email,
                password
            });
            if (response.status === 200 || response.status === 201) {
                Alert.alert('Thành công', 'Đăng ký thành công!');
                navigation.replace('Login');
            } else {
                Alert.alert('Lỗi', 'Đăng ký thất bại!');
            }
        } catch (error) {
            Alert.alert('Lỗi', error.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                placeholderTextColor={COLORS.lightGray}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.lightGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor={COLORS.lightGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor={COLORS.lightGray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.replace('Login')}
            >
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
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

export default Register; 