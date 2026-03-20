import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from './types';
import { colors } from '../theme/tokens';
import {
  AAConsentScreen,
  EarningsUploadScreen,
  KycPanScreen,
  KycSelfieScreen,
  LanguageSelectionScreen,
  MobileEntryScreen,
  OtpVerificationScreen,
  PlanSelectionScreen,
  PlatformSelectionScreen,
  SplashScreen,
  UpiAutopayScreen,
  Value1Screen,
  Value2Screen,
  Value3Screen,
  WelcomeScreen,
} from '../screens/onboarding';
import { EarningsScreen, HomeScreen, ProfileScreen, ProtectScreen, ZonesScreen } from '../screens/main';
import {
  ClaimDetailScreen,
  ClaimsHistoryScreen,
  DisruptionLiveScreen,
  HomeDisruptionScreen,
  NotificationsScreen,
  PayoutProcessingScreen,
  PayoutReceivedScreen,
  TrustKarmaDetailScreen,
} from '../screens/details';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.bluePrimary,
        tabBarInactiveTintColor: colors.grayMid,
        tabBarStyle: { height: 80, paddingBottom: 10 },
        tabBarIcon: ({ color, size }) => {
          const map: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home-outline',
            Protect: 'shield-checkmark-outline',
            Earnings: 'wallet-outline',
            Zones: 'map-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Protect' component={ProtectScreen} />
      <Tab.Screen name='Earnings' component={EarningsScreen} />
      <Tab.Screen name='Zones' component={ZonesScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.bgWarm,
          card: colors.bgWarm,
          text: colors.black,
          primary: colors.bluePrimary,
          border: '#F0EEE8',
        },
      }}
    >
      <Stack.Navigator
        initialRouteName='Splash'
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.bgWarm },
          headerTitleStyle: { fontFamily: 'DMSans_700Bold' },
          contentStyle: { backgroundColor: colors.bgWarm },
        }}
      >
        <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name='LanguageSelection' component={LanguageSelectionScreen} options={{ title: '' }} />
        <Stack.Screen name='Value1' component={Value1Screen} options={{ title: '' }} />
        <Stack.Screen name='Value2' component={Value2Screen} options={{ title: '' }} />
        <Stack.Screen name='Value3' component={Value3Screen} options={{ title: '' }} />
        <Stack.Screen name='MobileEntry' component={MobileEntryScreen} options={{ title: 'Your mobile number' }} />
        <Stack.Screen name='OtpVerification' component={OtpVerificationScreen} options={{ title: 'Verify your number' }} />
        <Stack.Screen name='KycSelfie' component={KycSelfieScreen} options={{ title: 'Verify your identity' }} />
        <Stack.Screen name='KycPan' component={KycPanScreen} options={{ title: 'PAN verification' }} />
        <Stack.Screen name='PlatformSelection' component={PlatformSelectionScreen} options={{ title: 'Select platforms' }} />
        <Stack.Screen name='EarningsUpload' component={EarningsUploadScreen} options={{ title: 'Show us your earnings' }} />
        <Stack.Screen name='AAConsent' component={AAConsentScreen} options={{ title: 'Verify with your bank' }} />
        <Stack.Screen name='PlanSelection' component={PlanSelectionScreen} options={{ title: 'Choose your protection', headerBackVisible: false }} />
        <Stack.Screen name='UpiAutopay' component={UpiAutopayScreen} options={{ title: 'Set up weekly payment' }} />
        <Stack.Screen name='Welcome' component={WelcomeScreen} options={{ title: '', headerBackVisible: false }} />
        <Stack.Screen name='MainTabs' component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name='HomeDisruption' component={HomeDisruptionScreen} options={{ title: 'Disruption active' }} />
        <Stack.Screen name='DisruptionLive' component={DisruptionLiveScreen} options={{ title: 'Live disruption' }} />
        <Stack.Screen name='PayoutProcessing' component={PayoutProcessingScreen} options={{ title: 'Payout processing' }} />
        <Stack.Screen name='PayoutReceived' component={PayoutReceivedScreen} options={{ title: 'Payout received' }} />
        <Stack.Screen name='TrustKarmaDetail' component={TrustKarmaDetailScreen} options={{ title: 'TrustKarma' }} />
        <Stack.Screen name='ClaimsHistory' component={ClaimsHistoryScreen} options={{ title: 'Claims history' }} />
        <Stack.Screen name='ClaimDetail' component={ClaimDetailScreen} options={{ title: 'Claim details' }} />
        <Stack.Screen name='Notifications' component={NotificationsScreen} options={{ title: 'Notifications' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
