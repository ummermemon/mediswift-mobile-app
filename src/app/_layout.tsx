import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { CartProvider } from '@/context/cart-context';
import { AuthProvider, useAuth } from '@/context/auth-context';
import BrandSplashScreen from '@/components/brand-splash-screen';

function AppNavigator() {
  const { isLoading } = useAuth();
  const [hasSplashElapsed, setHasSplashElapsed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasSplashElapsed(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading || !hasSplashElapsed) {
    return <BrandSplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
