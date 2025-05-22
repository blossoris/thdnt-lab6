import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { authService } from './Services/authService';
import Login from './screens/Login';
import { BookDetail } from "./screens";
import Tabs from "./navigation/tabs";
import { useFonts } from 'expo-font';
import Register from './screens/Register';
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent"
    }
}
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155

const Stack = createStackNavigator();

const App = () => {
    const [loaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const checkUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (!loaded || loading) {
        return null;
    }

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                initialRouteName={user ? "Tabs" : "Login"}
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Tabs" component={Tabs} />
                <Stack.Screen name="BookDetail" component={BookDetail} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;