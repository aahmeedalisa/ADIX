import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from '@expo-google-fonts/tajawal';

import { StoreProvider, useStore } from './src/context/StoreContext';
import { DeveloperProvider } from './src/context/DeveloperContext';
import { MainNavigator } from './src/navigation/MainNavigator';

import { ServiceScreen } from './src/screens/ServiceScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ProofScreen } from './src/screens/ProofScreen';
import { OrderDetailScreen } from './src/screens/OrderDetailScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { CouponsScreen } from './src/screens/CouponsScreen';
import { SupportScreen } from './src/screens/SupportScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { DeveloperAccountsScreen } from './src/screens/DeveloperAccountsScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { RefundScreen } from './src/screens/RefundScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { AdminScreen } from './src/screens/AdminScreen';

import { Icon, Txt } from './src/components/common/UI';

const Stack = createNativeStackNavigator();

const ToastOverlay: React.FC = () => {
  const { toast } = useStore();
  if (!toast) return null;

  return (
    <View style={styles.toastWrap} pointerEvents="none">
      <View style={styles.toast}>
        <Icon name="checkmark-circle-outline" size={20} color="#111" />
        <Txt style={styles.toastText}>{toast}</Txt>
      </View>
    </View>
  );
};

const RootApp: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: '#FFFFFF',
          background: '#0A0A0A',
          card: '#121212',
          text: '#FFFFFF',
          border: '#292929',
          notification: '#899a8d',
        },
        fonts: {
          regular: { fontFamily: 'Tajawal', fontWeight: 'normal' },
          medium: { fontFamily: 'Tajawal-Medium', fontWeight: '500' },
          bold: { fontFamily: 'Tajawal-Bold', fontWeight: 'bold' },
          heavy: { fontFamily: 'Tajawal-Bold', fontWeight: '900' },
        },
      }}
    >
      <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0A0A0A' },
            animation: 'fade_from_bottom',
            presentation: 'transparentModal',
          }}
        >
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Service" component={ServiceScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Proof" component={ProofScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Coupons" component={CouponsScreen} />
          <Stack.Screen name="Login" component={AuthScreen} />
          <Stack.Screen name="Register" component={AuthScreen} />
          <Stack.Screen name="Accounts" component={AccountsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Developer" component={DeveloperAccountsScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="Refund" component={RefundScreen} />
        </Stack.Navigator>

        <ToastOverlay />
      </View>
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    Tajawal: Tajawal_400Regular,
    'Tajawal-Medium': Tajawal_500Medium,
    'Tajawal-Bold': Tajawal_700Bold,
    'Tajawal-ExtraBold': Tajawal_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#AAA" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <DeveloperProvider>
          <RootApp />
        </DeveloperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastWrap: {
    position: 'absolute',
    bottom: 85,
    alignSelf: 'center',
    zIndex: 99999,
    elevation: 60,
    maxWidth: '92%',
  },
  toast: {
    flexDirection: 'row-reverse',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  toastText: {
    fontSize: 13,
    color: '#161616',
    flexShrink: 1,
    fontFamily: 'Tajawal',
  },
});
