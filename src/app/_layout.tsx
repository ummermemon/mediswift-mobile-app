import { Stack } from 'expo-router';

import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
