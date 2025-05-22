import AsyncStorage from '@react-native-async-storage/async-storage';

// Thay YOUR_IP_ADDRESS bằng IP của máy tính của bạn
const API_URL = 'http://192.168.20.22:5021/api';

export const authService = {
    async login(username, password) {
        try {
            console.log('Attempting login to:', `${API_URL}/auth/login`);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                return { success: true, token: data.token };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'Network request failed. Please check your connection and try again.' 
            };
        }
    },

    async register(username, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async logout() {
        try {
            await AsyncStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async getToken() {
        try {
            return await AsyncStorage.getItem('token');
        } catch (error) {
            return null;
        }
    },

    async getCurrentUser() {
        try {
            const token = await this.getToken();
            if (!token) return null;

            // Gọi API để lấy thông tin user
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
}; 